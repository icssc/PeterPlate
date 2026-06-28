import { z } from "zod";

// PeterPlate feedback form
export const feedbackFormDataSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  allowFollowUp: z.boolean(),
  feedbackType: z.string(),
  feedbackDescription: z.string(),
  experienceRating: z.number(),
  completionStatus: z.string(),
  deviceType: z.string(),
  additionalComments: z.string(),
  supportingFile: z.instanceof(File).nullable(),
});

export type FeedbackFormData = z.infer<typeof feedbackFormDataSchema>;
