/**
 * Admin Content API Route
 * GET/POST/PUT/DELETE /api/admin/content/[type]
 * Handles CRUD operations for all content types
 */
import { requireAuth } from '@/lib/admin/auth';
import { DataFile, generateId, readData, writeData } from '@/lib/admin/storage';
import { NextRequest, NextResponse } from 'next/server';

const VALID_TYPES: DataFile[] = [
  'site-settings',
  'categories',
  'projects',
  'services',
  'clients',
  'team',
  'homepage',
  'menu',
  'featured-works',
  'portfolio-slider',
  'blog',
  'gallery',
  'services-slider',
  'digital-services',
  'legal',
  'about',
];

type RouteContext = {
  params: Promise<{ type: string }>;
};

/**
 * GET - Read content
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { authenticated, response } = await requireAuth(request);
  if (!authenticated) return response;

  const params = await context.params;
  const type = params.type as DataFile;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const data = await readData(type);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(`Error reading ${type}:`, error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

/**
 * POST - Create new item or update entire content
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { authenticated, response } = await requireAuth(request);
  if (!authenticated) return response;

  const params = await context.params;
  const type = params.type as DataFile;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    // For site-settings and homepage, replace entire content
    if (type === 'site-settings' || type === 'homepage' || type === 'menu') {
      await writeData(type, body);
      return NextResponse.json({ success: true, data: body });
    }

    // For array-based content, add new item
    const existingData = await readData<Record<string, unknown[]>>(type);
    const arrayKey = getArrayKey(type);
    
    if (!arrayKey || !Array.isArray(existingData[arrayKey])) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    const newItem = {
      ...body,
      id: generateId(),
      order: existingData[arrayKey].length + 1,
    };

    existingData[arrayKey].push(newItem);
    await writeData(type, existingData);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

/**
 * PUT - Update existing item
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  const { authenticated, response } = await requireAuth(request);
  if (!authenticated) return response;

  const params = await context.params;
  const type = params.type as DataFile;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // For site-settings and homepage, replace entire content
    if (type === 'site-settings' || type === 'homepage' || type === 'menu') {
      await writeData(type, body);
      return NextResponse.json({ success: true, data: body });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existingData = await readData<Record<string, unknown[]>>(type);
    const arrayKey = getArrayKey(type);

    if (!arrayKey || !Array.isArray(existingData[arrayKey])) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    const index = existingData[arrayKey].findIndex((item: { id?: string }) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    existingData[arrayKey][index] = { ...existingData[arrayKey][index], ...updates, id };
    await writeData(type, existingData);

    return NextResponse.json({ success: true, data: existingData[arrayKey][index] });
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

/**
 * DELETE - Remove item
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const { authenticated, response } = await requireAuth(request);
  if (!authenticated) return response;

  const params = await context.params;
  const type = params.type as DataFile;

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existingData = await readData<Record<string, unknown[]>>(type);
    const arrayKey = getArrayKey(type);

    if (!arrayKey || !Array.isArray(existingData[arrayKey])) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    const index = existingData[arrayKey].findIndex((item: { id?: string }) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    existingData[arrayKey].splice(index, 1);
    await writeData(type, existingData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}

/**
 * Helper to get the array key for each content type
 */
function getArrayKey(type: DataFile): string | null {
  const mapping: Record<string, string> = {
    categories: 'categories',
    projects: 'projects',
    services: 'services',
    clients: 'clients',
    team: 'team',
    'featured-works': 'featuredWorks',
    'portfolio-slider': 'slides',
    blog: 'posts',
    gallery: 'galleryImages',
    'services-slider': 'videos',
    'digital-services': 'digitalServices',
  };
  return mapping[type] || null;
}
