import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { VisitorType } from '@/types';

// Validation constants
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 standard maximum reverse-path address length
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_VISITOR_TYPES: VisitorType[] = ['developer', 'recruiter', 'student', 'explorer'];

/**
 * Escapes special HTML characters to prevent injection in email clients.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resilient Supabase client factory for server execution.
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { name, email, message, visitorType, sessionId } = body || {};

    // 1. Validation: Name
    if (!name || typeof name !== 'string' || name.trim().length < MIN_NAME_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Name must be at least ${MIN_NAME_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Name must not exceed ${MAX_NAME_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 2. Validation: Email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }
    if (email.trim().length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Email address must not exceed ${MAX_EMAIL_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 3. Validation: Message
    if (!message || typeof message !== 'string' || message.trim().length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Message must be at least ${MIN_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // 4. Validation: Visitor Type
    const validatedVisitorType: VisitorType =
      typeof visitorType === 'string' && VALID_VISITOR_TYPES.includes(visitorType as VisitorType)
        ? (visitorType as VisitorType)
        : 'developer';

    // Strip carriage return and newline characters to neutralize CRLF injection
    const cleanName = (name as string).replace(/[\r\n]+/g, ' ').trim();
    const cleanEmail = (email as string).trim();
    const cleanMessage = (message as string).trim();
    const cleanSessionId =
      typeof sessionId === 'string' && sessionId.trim() ? sessionId.trim() : null;

    // 5. Database Persistence (with schema fallback)
    let supabaseSuccess = false;
    let supabaseAttempted = false;

    const supabase = getSupabaseClient();
    if (supabase) {
      supabaseAttempted = true;
      try {
        // Primary attempt: Insert with explicit name column
        const { error: primaryError } = await supabase.from('visitor_messages').insert({
          name: cleanName,
          email: cleanEmail,
          message: cleanMessage,
          visitor_type: validatedVisitorType,
          session_id: cleanSessionId,
        });

        if (!primaryError) {
          supabaseSuccess = true;
        } else {
          console.warn(
            '[Contact API] Primary insert with "name" column failed. Triggering schema fallback:',
            primaryError.message
          );

          // Fallback attempt: Prepend name to message for legacy schema compatibility
          const fallbackMessage = `From: ${cleanName} <${cleanEmail}>\n\n${cleanMessage}`;
          const { error: fallbackError } = await supabase.from('visitor_messages').insert({
            email: cleanEmail,
            message: fallbackMessage,
            visitor_type: validatedVisitorType,
            session_id: cleanSessionId,
          });

          if (!fallbackError) {
            supabaseSuccess = true;
          } else {
            console.error('[Contact API] Fallback message insert failed:', fallbackError.message);
          }
        }
      } catch (dbErr) {
        console.error('[Contact API] Unexpected error during database insertion:', dbErr);
      }
    } else {
      console.warn(
        '[Contact API] Supabase environment variables missing; running in mock/offline mode.'
      );
    }

    // 6. Resend Email Notification via native HTTP fetch
    let resendSuccess = false;
    let resendAttempted = false;

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = 'shaik.rohit.official@gmail.com';

    // Explicitly guarantee subject line is free from newline/carriage return characters
    const cleanSubjectName = cleanName.replace(/[\r\n]+/g, ' ').trim();

    if (resendApiKey) {
      resendAttempted = true;
      try {
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #07090e; color: #f8fafc; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0d1117; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; text-align: left;">
      <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">💬 New Portfolio Inquiry</h1>
      <p style="color: #e0e7ff; margin: 0; font-size: 14px;">A new message was received from not-a-portfolio contact form.</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; width: 110px; font-weight: 600; text-transform: uppercase;">Sender</td>
          <td style="padding: 8px 0; color: #f8fafc; font-size: 15px; font-weight: 600;">${escapeHtml(cleanName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Email</td>
          <td style="padding: 8px 0; color: #38bdf8; font-size: 15px;">
            <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(cleanEmail)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Persona</td>
          <td style="padding: 8px 0;">
            <span style="display: inline-block; background-color: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #c7d2fe; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: capitalize;">${escapeHtml(validatedVisitorType)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Timestamp</td>
          <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">${new Date().toUTCString()}</td>
        </tr>
      </table>

      <div style="margin-top: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Message</p>
        <div style="background-color: #161b22; border-left: 4px solid #6366f1; border-radius: 6px; padding: 16px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${escapeHtml(cleanMessage)}</div>
      </div>

      <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <a href="mailto:${escapeHtml(cleanEmail)}?subject=Re:%20Portfolio%20Inquiry%20from%20Shaik%20Rohit" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to ${escapeHtml(cleanName)}</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to: recipientEmail,
            reply_to: cleanEmail,
            subject: `💬 Portfolio Contact: ${cleanSubjectName} (${validatedVisitorType})`,
            html: emailHtml,
          }),
        });

        if (resendRes.ok) {
          resendSuccess = true;
        } else {
          const errText = await resendRes.text();
          console.error('[Contact API] Resend dispatch error:', resendRes.status, errText);
        }
      } catch (emailErr) {
        console.error('[Contact API] Network error dispatching Resend email:', emailErr);
      }
    } else {
      console.warn('[Contact API] RESEND_API_KEY missing. Email notification skipped.');
      console.warn(
        `[Contact API] Mock Dispatch: From="${cleanName}" <${cleanEmail}> Type="${validatedVisitorType}"`
      );
    }

    // 7. Delivery Evaluation & Response Handling
    const hasConfiguredDelivery = supabaseAttempted || resendAttempted;

    if (hasConfiguredDelivery) {
      const anyDelivered = supabaseSuccess || resendSuccess;
      if (!anyDelivered) {
        console.error(
          '[Contact API] Critical Delivery Failure: All configured delivery channels failed.',
          { supabaseAttempted, supabaseSuccess, resendAttempted, resendSuccess }
        );
        return NextResponse.json(
          {
            success: false,
            error:
              'Unable to deliver your message at this time. Please contact directly via email.',
          },
          { status: 500 }
        );
      }
    } else {
      // Offline / Unconfigured Mode (Development, E2E tests, Static Demo)
      const isStrictProduction =
        process.env.NODE_ENV === 'production' && process.env.REQUIRE_DELIVERY_IN_PROD === 'true';

      if (isStrictProduction) {
        console.error(
          '[Contact API] Production delivery unconfigured and REQUIRE_DELIVERY_IN_PROD is enabled.'
        );
        return NextResponse.json(
          {
            success: false,
            error:
              'Contact services are temporarily unavailable. Please contact directly via email.',
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your message has been received.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact API] Uncaught handler error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An internal server error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
