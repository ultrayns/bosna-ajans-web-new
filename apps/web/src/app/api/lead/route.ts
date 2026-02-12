import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  fileName?: string;
  filePath?: string;
}

// In-memory storage for leads (will be replaced with CMS/database)
const leads: LeadData[] = [];

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  // Rate limiting - 5 requests per minute per IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`lead:${clientIp}`, { maxRequests: 5, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetIn);
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let data: LeadData;
    let file: File | null = null;

    // Handle both JSON and FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = {
        name: formData.get('name') as string || '',
        email: formData.get('email') as string || '',
        company: formData.get('company') as string || '',
        phone: formData.get('phone') as string || '',
        service: formData.get('service') as string || '',
        budget: formData.get('budget') as string || '',
        message: formData.get('message') as string || '',
      };
      
      const uploadedFile = formData.get('file');
      if (uploadedFile && uploadedFile instanceof File && uploadedFile.size > 0) {
        file = uploadedFile;
      }
    } else {
      data = await request.json();
    }

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Handle file upload
    if (file) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF, Word, and image files are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        );
      }

      // Save file to uploads directory
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'leads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}-${safeName}`;
      const filePath = path.join(uploadsDir, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      data.fileName = file.name;
      data.filePath = `/uploads/leads/${fileName}`;
    }

    // Store lead (in production, this would go to CMS/database)
    const lead = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    leads.push(lead);
    
    // Log for development
    console.log('New lead received:', lead);

    // Send email notification
    let emailSent = false;
    try {
      const emailResponse = await fetch(new URL('/api/email', request.url).href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      emailSent = emailResponse.ok;
    } catch (emailError) {
      console.warn('Email notification failed:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      emailSent,
      hasFile: !!data.filePath,
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return leads count for admin/debug purposes
  return NextResponse.json({ 
    count: leads.length,
    leads: leads.slice(-10) // Last 10 leads
  });
}
