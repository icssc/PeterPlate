import { type NextRequest, NextResponse } from "next/server";

interface FeedbackFormData {
  fullName: string;
  email: string;
  allowFollowUp: boolean;
  feedbackType: string;
  feedbackDescription: string;
  experienceRating: number;
  completionStatus: string;
  deviceType: string;
  additionalComments: string;
}

async function submitToDiscord(formData: FeedbackFormData): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not configured");
    return false;
  }

  try {
    const embed = {
      title: "New PeterPlate Feedback",
      description: formData.feedbackDescription,
      color: 0x0069a8,
      fields: [
        {
          name: "Full Name",
          value: formData.fullName,
          inline: true,
        },
        {
          name: "Email",
          value: formData.email,
          inline: true,
        },
        {
          name: "Feedback Type",
          value: formData.feedbackType,
          inline: true,
        },
        {
          name: "Experience Rating",
          value: `${formData.experienceRating}/5`,
          inline: true,
        },
        {
          name: "Completion Status",
          value: formData.completionStatus,
          inline: true,
        },
        {
          name: "Allow Follow-up",
          value: formData.allowFollowUp ? "Yes" : "No",
          inline: true,
        },
        ...(formData.deviceType
          ? [
              {
                name: "Device Type",
                value: formData.deviceType,
                inline: true,
              },
            ]
          : []),
        ...(formData.additionalComments
          ? [
              {
                name: "Additional Comments",
                value: formData.additionalComments,
                inline: false,
              },
            ]
          : []),
      ],
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Discord submission error:", error);
    return false;
  }
}

async function submitToGoogleSheets(
  formData: FeedbackFormData,
): Promise<boolean> {
  const scriptsUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptsUrl) {
    console.error("GOOGLE_APPS_SCRIPT_URL not configured");
    return false;
  }

  try {
    const response = await fetch(scriptsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        allowFollowUp: formData.allowFollowUp,
        feedbackType: formData.feedbackType,
        feedbackDescription: formData.feedbackDescription,
        experienceRating: formData.experienceRating,
        completionStatus: formData.completionStatus,
        deviceType: formData.deviceType,
        additionalComments: formData.additionalComments,
        submittedAt: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Google Sheets submission error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: FeedbackFormData = await request.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const scriptsUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!webhookUrl || !scriptsUrl)
      return NextResponse.json(
        { error: "Missing webhook and/or scripts env variable" },
        { status: 400 },
      );

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.feedbackDescription ||
      !formData.feedbackType ||
      formData.experienceRating === 0 ||
      !formData.completionStatus
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Submit to Discord and Google Sheets in parallel
    const [discordSuccess, sheetsSuccess] = await Promise.all([
      submitToDiscord(formData),
      submitToGoogleSheets(formData),
    ]);

    // Both should succeed, but we'll accept if at least one works
    if (discordSuccess || sheetsSuccess) {
      return NextResponse.json(
        {
          success: true,
          message: "Feedback submitted successfully",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to submit feedback to all services" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
