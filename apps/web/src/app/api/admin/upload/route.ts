/**
 * Admin File Upload API Route
 * POST /api/admin/upload
 * 
 * Features:
 * - Automatic WebP conversion for images
 * - Automatic compression for videos (720p, CRF 28)
 */
import { requireAuth } from '@/lib/admin/auth';
import ffmpegStatic from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

// Set ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'media', 'uploads');

export async function POST(request: NextRequest) {
  const { authenticated, response } = await requireAuth(request);
  if (!authenticated) return response;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    const uploadPath = path.join(UPLOAD_DIR, folder);
    await mkdir(uploadPath, { recursive: true });

    // Initial file processing
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
    const timestamp = Date.now();
    
    let finalFileName = '';
    let finalPath = '';
    let mimeType = file.type;

    // IMAGE OPTIMIZATION (Convert to WebP)
    if (file.type.startsWith('image/') && ext !== '.svg') {
      finalFileName = `${baseName}-${timestamp}.webp`;
      finalPath = path.join(uploadPath, finalFileName);
      mimeType = 'image/webp';

      await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true }) // Max 1920px width/height
        .webp({ quality: 80 }) // 80% quality
        .toFile(finalPath);
    } 
    // VIDEO OPTIMIZATION (Compress)
    else if (file.type.startsWith('video/')) {
      finalFileName = `${baseName}-${timestamp}.mp4`;
      finalPath = path.join(uploadPath, finalFileName);
      mimeType = 'video/mp4';

      // Write temp file for ffmpeg
      const tempPath = path.join(uploadPath, `temp-${timestamp}${ext}`);
      await writeFile(tempPath, buffer);

      // Compress video using ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(tempPath)
          .outputOptions([
            '-c:v libx264',
            '-crf 28',        // Compression level
            '-preset fast',   // Speed/Compression balance
            '-vf scale=-2:720', // Scale to 720p height, keep aspect ratio
            '-c:a aac',       // Audio codec
            '-b:a 128k'       // Audio bitrate
          ])
          .save(finalPath)
          .on('end', async () => {
            await unlink(tempPath); // Remove temp file
            resolve(true);
          })
          .on('error', async (err) => {
            console.error('FFmpeg error:', err);
            await unlink(tempPath); // Remove temp file on error
            reject(err);
          });
      });
    }
    // OTHER FILES (Keep as is)
    else {
      finalFileName = `${baseName}-${timestamp}${ext}`;
      finalPath = path.join(uploadPath, finalFileName);
      await writeFile(finalPath, buffer);
    }

    // Return public URL
    const publicUrl = `/media/uploads/${folder}/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      type: mimeType,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
