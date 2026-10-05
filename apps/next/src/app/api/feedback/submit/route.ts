import type { FeedbackFormData } from "@peterplate/validators";
import { type NextRequest, NextResponse } from "next/server";

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
        ...(formData.supportingFile
          ? [
              {
                name: "Supporting File",
                value: `${formData.supportingFile.name} (${formData.supportingFile.type || "unknown type"})`,
                inline: false,
              },
            ]
          : []),
      ],
      timestamp: new Date().toISOString(),
    };

    const response = formData.supportingFile
      ? await submitDiscordWithAttachment(
          webhookUrl,
          embed,
          formData.supportingFile,
        )
      : await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [embed],
          }),
        });

    if (!response.ok) {
      console.error(
        "Discord submission failed:",
        response.status,
        await response.text(),
      );
    }

    return response.ok;
  } catch (error) {
    console.error("Discord submission error:", error);
    return false;
  }
}

async function submitDiscordWithAttachment(
  webhookUrl: string,
  embed: Record<string, unknown>,
  file: File,
) {
  const body = new FormData();

  body.append(
    "payload_json",
    JSON.stringify({
      embeds: [embed],
    }),
  );
  body.append("files[0]", file, file.name);

  return fetch(webhookUrl, {
    method: "POST",
    body,
  });
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
        supportingFileName: formData.supportingFile?.name ?? "",
        supportingFileType: formData.supportingFile?.type ?? "",
        supportingFileSize: formData.supportingFile?.size ?? 0,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(
        "Google Sheets submission failed:",
        response.status,
        await response.text(),
      );
    }

    return response.ok;
  } catch (error) {
    console.error("Google Sheets submission error:", error);
    return false;
  }
}

function parseBoolean(value: FormDataEntryValue | boolean | null | undefined) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  return value === "true" || value === "yes" || value === "on";
}

function parseNumber(value: FormDataEntryValue | number | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseString(value: FormDataEntryValue | string | null | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

async function parseFeedbackFormData(
  request: NextRequest,
): Promise<FeedbackFormData> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const supportingFile = formData.get("supportingFile");

    return {
      fullName: parseString(formData.get("fullName")),
      email: parseString(formData.get("email")),
      allowFollowUp: parseBoolean(formData.get("allowFollowUp")),
      feedbackType: parseString(formData.get("feedbackType")),
      feedbackDescription: parseString(formData.get("feedbackDescription")),
      experienceRating: parseNumber(formData.get("experienceRating")),
      completionStatus: parseString(formData.get("completionStatus")),
      deviceType: parseString(formData.get("deviceType")),
      additionalComments: parseString(formData.get("additionalComments")),
      supportingFile:
        supportingFile instanceof File && supportingFile.size > 0
          ? supportingFile
          : null,
    };
  }

  const formData = (await request.json()) as Partial<FeedbackFormData>;

  return {
    fullName: formData.fullName?.trim() ?? "",
    email: formData.email?.trim() ?? "",
    allowFollowUp: Boolean(formData.allowFollowUp),
    feedbackType: formData.feedbackType?.trim() ?? "",
    feedbackDescription: formData.feedbackDescription?.trim() ?? "",
    experienceRating: Number(formData.experienceRating) || 0,
    completionStatus: formData.completionStatus?.trim() ?? "",
    deviceType: formData.deviceType?.trim() ?? "",
    additionalComments: formData.additionalComments?.trim() ?? "",
    supportingFile: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await parseFeedbackFormData(request);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const scriptsUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!webhookUrl && !scriptsUrl) {
      const detail =
        process.env.NODE_ENV !== "production"
          ? " — set DISCORD_WEBHOOK_URL and/or GOOGLE_APPS_SCRIPT_URL in apps/next/.env.local (the root .env is not read by Next.js)"
          : "";
      console.error(
        "Feedback submission is not configured: neither DISCORD_WEBHOOK_URL nor GOOGLE_APPS_SCRIPT_URL is set",
      );
      return NextResponse.json(
        { error: `Feedback submission is not configured${detail}` },
        { status: 500 },
      );
    }

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

    const submissions = await Promise.all([
      webhookUrl
        ? submitToDiscord(formData).then((success) => ({
            destination: "discord",
            success,
          }))
        : Promise.resolve(null),
      scriptsUrl
        ? submitToGoogleSheets(formData).then((success) => ({
            destination: "googleSheets",
            success,
          }))
        : Promise.resolve(null),
    ]);

    const results = submissions.filter(
      (submission): submission is { destination: string; success: boolean } =>
        submission !== null,
    );
    const successCount = results.filter((result) => result.success).length;

    if (successCount > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Feedback submitted successfully",
          destinations: Object.fromEntries(
            results.map((result) => [result.destination, result.success]),
          ),
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to submit feedback to the configured services",
          destinations: Object.fromEntries(
            results.map((result) => [result.destination, result.success]),
          ),
        },
        { status: 502 },
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
