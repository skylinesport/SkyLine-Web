import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOGO_URL = "https://sxqoybifpuoiteaiotkc.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1";

// Email template styles
const styles = {
  container: `max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`,
  header: `background-color: #0a0a0a; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;`,
  logo: `height: 40px; filter: invert(1);`,
  body: `background-color: #ffffff; padding: 40px 32px; color: #1a1a1a;`,
  heading: `font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #0a0a0a;`,
  text: `font-size: 16px; line-height: 24px; color: #4a4a4a; margin-bottom: 16px;`,
  button: `display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0;`,
  code: `display: inline-block; background-color: #f4f4f5; padding: 12px 24px; border-radius: 8px; font-family: monospace; font-size: 24px; letter-spacing: 4px; font-weight: 700; color: #0a0a0a; margin: 16px 0;`,
  footer: `background-color: #f9fafb; padding: 24px 32px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;`,
  footerText: `font-size: 14px; color: #6b7280; margin: 0;`,
  muted: `font-size: 14px; color: #9ca3af; margin-top: 24px;`,
};

// Generate verification email HTML
function verificationEmailHtml(confirmUrl: string): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <img src="${LOGO_URL}" alt="SkyLine" style="${styles.logo}" />
      </div>
      <div style="${styles.body}">
        <h1 style="${styles.heading}">Verify your email</h1>
        <p style="${styles.text}">
          Welcome to SkyLine! Click the button below to verify your email address and start tracking your achievements.
        </p>
        <div style="text-align: center;">
          <a href="${confirmUrl}" style="${styles.button}">
            Verify Email Address
          </a>
        </div>
        <p style="${styles.text}">
          Or copy and paste this link into your browser:
        </p>
        <p style="${styles.text}; word-break: break-all; color: #3b82f6;">
          ${confirmUrl}
        </p>
        <p style="${styles.muted}">
          If you didn't create an account on SkyLine, you can safely ignore this email.
        </p>
      </div>
      <div style="${styles.footer}">
        <p style="${styles.footerText}">
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  `;
}

// Generate password reset email HTML
function passwordResetEmailHtml(resetUrl: string): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <img src="${LOGO_URL}" alt="SkyLine" style="${styles.logo}" />
      </div>
      <div style="${styles.body}">
        <h1 style="${styles.heading}">Reset your password</h1>
        <p style="${styles.text}">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <div style="text-align: center;">
          <a href="${resetUrl}" style="${styles.button}">
            Reset Password
          </a>
        </div>
        <p style="${styles.muted}">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
      <div style="${styles.footer}">
        <p style="${styles.footerText}">
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  `;
}

// Generate magic link email HTML
function magicLinkEmailHtml(magicUrl: string, token: string): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <img src="${LOGO_URL}" alt="SkyLine" style="${styles.logo}" />
      </div>
      <div style="${styles.body}">
        <h1 style="${styles.heading}">Sign in to SkyLine</h1>
        <p style="${styles.text}">
          Click the button below to sign in to your SkyLine account. No password needed!
        </p>
        <div style="text-align: center;">
          <a href="${magicUrl}" style="${styles.button}">
            Sign In to SkyLine
          </a>
        </div>
        <p style="${styles.text}">
          Or use this one-time code:
        </p>
        <div style="text-align: center;">
          <span style="${styles.code}">${token}</span>
        </div>
        <p style="${styles.muted}">
          This link and code will expire in 10 minutes.
        </p>
      </div>
      <div style="${styles.footer}">
        <p style="${styles.footerText}">
          © 2025 SkyLine. Track your achievements, build your identity.
        </p>
      </div>
    </div>
  `;
}

interface EmailRequest {
  type: "verification" | "password_reset" | "magic_link";
  email: string;
  url: string;
  token?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, email, url, token }: EmailRequest = await req.json();

    console.log(`Sending ${type} email to ${email}`);

    let subject: string;
    let html: string;

    switch (type) {
      case "verification":
        subject = "Verify your SkyLine account";
        html = verificationEmailHtml(url);
        break;
      case "password_reset":
        subject = "Reset your SkyLine password";
        html = passwordResetEmailHtml(url);
        break;
      case "magic_link":
        subject = "Sign in to SkyLine";
        html = magicLinkEmailHtml(url, token || "");
        break;
      default:
        throw new Error("Invalid email type");
    }

    const { data, error } = await resend.emails.send({
      from: "SkyLine <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      // Return specific error for domain verification needed
      if (error.message?.includes("verify a domain")) {
        return new Response(
          JSON.stringify({ 
            error: "Domain verification required", 
            details: "Please verify a domain at resend.com/domains to send emails to all recipients."
          }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
