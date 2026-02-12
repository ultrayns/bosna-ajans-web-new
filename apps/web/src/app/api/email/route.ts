import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email notification
 * Uses environment variable EMAIL_API_KEY for authentication
 * Supports multiple email providers: SendGrid, Mailgun, Resend
 */
async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const emailProvider = process.env.EMAIL_PROVIDER || 'console';
  const apiKey = process.env.EMAIL_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@bosnaajans.com';

  // Development: Log to console
  if (emailProvider === 'console' || !apiKey) {
    console.log('📧 Email would be sent:');
    console.log('  To:', payload.to);
    console.log('  Subject:', payload.subject);
    console.log('  HTML:', payload.html.substring(0, 200) + '...');
    return true;
  }

  try {
    // SendGrid
    if (emailProvider === 'sendgrid') {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: payload.to }] }],
          from: { email: fromEmail },
          reply_to: payload.replyTo ? { email: payload.replyTo } : undefined,
          subject: payload.subject,
          content: [{ type: 'text/html', value: payload.html }],
        }),
      });
      return response.ok;
    }

    // Resend
    if (emailProvider === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: payload.to,
          reply_to: payload.replyTo,
          subject: payload.subject,
          html: payload.html,
        }),
      });
      return response.ok;
    }

    console.warn('Unknown email provider:', emailProvider);
    return false;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

/**
 * Format lead data as HTML email
 */
function formatLeadEmail(data: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { margin-top: 5px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Yeni İletişim Formu</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Ad Soyad</div>
        <div class="value">${data.name || '-'}</div>
      </div>
      <div class="field">
        <div class="label">E-posta</div>
        <div class="value">${data.email || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Şirket</div>
        <div class="value">${data.company || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Telefon</div>
        <div class="value">${data.phone || '-'}</div>
      </div>
      <div class="field">
        <div class="label">İlgilenilen Hizmet</div>
        <div class="value">${data.service || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Bütçe</div>
        <div class="value">${data.budget || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Mesaj</div>
        <div class="value">${data.message || '-'}</div>
      </div>
    </div>
    <div class="footer">
      Bu e-posta bosnaajans.com iletişim formundan otomatik olarak gönderilmiştir.
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  // Rate limiting - 10 requests per minute per IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`email:${clientIp}`, { maxRequests: 10, windowMs: 60000 });
  
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetIn);
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'hello@bosnaajans.com';

    // Send notification email
    const emailSent = await sendEmail({
      to: notificationEmail,
      subject: `Yeni İletişim Formu: ${data.name}`,
      html: formatLeadEmail(data),
      replyTo: data.email,
    });

    if (emailSent) {
      console.log('✅ Notification email sent successfully');
    } else {
      console.warn('⚠️ Notification email could not be sent');
    }

    return NextResponse.json({
      success: true,
      emailSent,
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
