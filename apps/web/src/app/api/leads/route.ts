import { mkdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

// Leads are stored locally in JSON format
const LEADS_DIR = join(process.cwd(), 'src', 'lib', 'data');
const LEADS_FILE = join(LEADS_DIR, 'leads.json');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const { name, email, phone, projectType, message, source } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create lead object
        const lead = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone || '',
            projectType: projectType || '',
            message,
            source: source || 'website',
            createdAt: new Date().toISOString(),
        };

        // Log the lead
        console.log('New lead received:', lead);

        // Try to save to file (optional - for persistence)
        try {
            await mkdir(LEADS_DIR, { recursive: true });
            
            // Read existing leads
            let leads = [];
            try {
                const { readFile } = await import('fs/promises');
                const content = await readFile(LEADS_FILE, 'utf-8');
                const data = JSON.parse(content);
                leads = data.leads || [];
            } catch {
                // File doesn't exist yet
            }

            // Add new lead
            leads.push(lead);

            // Write back
            const { writeFile } = await import('fs/promises');
            await writeFile(LEADS_FILE, JSON.stringify({ leads }, null, 2));
        } catch (err) {
            console.error('Could not save lead to file:', err);
            // Continue anyway - lead was logged
        }
        
        return NextResponse.json({ success: true, leadId: lead.id });
    } catch (error) {
        console.error('Lead submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET - retrieve all leads (for admin)
export async function GET() {
    try {
        const { readFile } = await import('fs/promises');
        const content = await readFile(LEADS_FILE, 'utf-8');
        const data = JSON.parse(content);
        return NextResponse.json({ success: true, data: data.leads || [] });
    } catch {
        return NextResponse.json({ success: true, data: [] });
    }
}
