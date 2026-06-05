import { NextRequest, NextResponse } from "next/server";
import { getEnvVar } from "@/utils/env";

/**
 * POST /api/contact
 * Server-side proxy for EmailJS so that secrets stay out of the browser.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, message) are required." },
        { status: 400 }
      );
    }

    // Read secrets from Cloudflare env / process.env (server-side only)
    const serviceId = getEnvVar("EMAILJS_SERVICE_ID");
    const templateId = getEnvVar("EMAILJS_TEMPLATE_ID");
    const publicKey = getEnvVar("EMAILJS_PUBLIC_KEY");
    const privateKey = getEnvVar("EMAILJS_PRIVATE_KEY");

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.error("Missing EmailJS configuration:", {
        hasServiceId: !!serviceId,
        hasTemplateId: !!templateId,
        hasPublicKey: !!publicKey,
        hasPrivateKey: !!privateKey,
      });
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // Call EmailJS REST API
    const emailjsResponse = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            from_name: name,
            from_email: email,
            message,
          },
        }),
      }
    );

    if (!emailjsResponse.ok) {
      const errorText = await emailjsResponse.text();
      console.error("EmailJS error:", emailjsResponse.status, errorText);
      return NextResponse.json(
        { error: `EmailJS error: ${errorText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
