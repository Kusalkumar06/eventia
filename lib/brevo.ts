export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.warn("BREVO_API_KEY is missing. Email will not be sent.");
      return false;
    }

    const senderEmail = process.env.EMAIL_FROM || "kusal.projects.dev@gmail.com";
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Eventia",
          email: senderEmail,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error details:", JSON.stringify(errorData, null, 2));
      return false;
    }

    console.log(`Email to ${to} sent successfully via Brevo`);
    return true;
  } catch (error: unknown) {
    console.error("Failed to execute Brevo fetch request:", error);
    return false;
  }
}
