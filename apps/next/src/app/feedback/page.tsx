"use client";

import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { FeedbackFormData } from "@peterplate/validators";
import { useState } from "react";

const DARK_MODE_SELECTOR = ".dark &";

const sectionCardSx = {
  bgcolor: "white",
  border: "1px solid rgba(226, 232, 240, 0.9)",
  borderRadius: 2,
  boxShadow: "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
  p: { xs: 3, sm: 4 },
  [DARK_MODE_SELECTOR]: {
    bgcolor: "#313136",
    borderColor: "#3F3F47",
    boxShadow: "0px 12px 28px rgba(0,0,0,0.32)",
  },
};

const sectionTitleSx = {
  fontWeight: 600,
  mb: 3,
  color: "#0f172b",
  [DARK_MODE_SELECTOR]: {
    color: "#fafafa",
  },
};

const labelSx = {
  display: "block",
  mb: 1,
  fontSize: "14px",
  fontWeight: 500,
  color: "#314158",
  [DARK_MODE_SELECTOR]: {
    color: "rgba(255,255,255,0.88)",
  },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "white",
    color: "#020618",
    borderRadius: 1.5,
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "& fieldset": {
      borderColor: "#d1d5dc",
    },
    "&:hover fieldset": {
      borderColor: "#0069a8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0069a8",
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input, & .MuiInputBase-inputMultiline": {
    color: "#020618",
  },
  "& .MuiInputBase-input::placeholder, & .MuiInputBase-inputMultiline::placeholder":
    {
      color: "#9ca3af",
      opacity: 1,
    },
  [DARK_MODE_SELECTOR]: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(63,63,71,0.4)",
      color: "#fafafa",
      "& fieldset": {
        borderColor: "#52525b",
      },
      "&:hover fieldset": {
        borderColor: "#8EC5FF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#8EC5FF",
      },
    },
    "& .MuiInputBase-input, & .MuiInputBase-inputMultiline": {
      color: "#fafafa",
    },
    "& .MuiInputBase-input::placeholder, & .MuiInputBase-inputMultiline::placeholder":
      {
        color: "rgba(255,255,255,0.5)",
      },
  },
};

const selectSx = {
  ...inputSx,
  "& .MuiSelect-select": {
    color: "#020618",
  },
  "& .MuiSvgIcon-root": {
    color: "#6a7282",
  },
  [DARK_MODE_SELECTOR]: {
    "& .MuiSelect-select": {
      color: "#fafafa",
    },
    "& .MuiSvgIcon-root": {
      color: "#d4d4d8",
    },
  },
};

const menuPaperSx = {
  border: "1px solid rgba(226, 232, 240, 0.9)",
  mt: 1,
  [DARK_MODE_SELECTOR]: {
    bgcolor: "#323235",
    color: "#fafafa",
    borderColor: "#52525b",
  },
};

const radioSx = {
  color: "#0069a8",
  "&.Mui-checked": {
    color: "#0069a8",
  },
  [DARK_MODE_SELECTOR]: {
    color: "#8EC5FF",
    "&.Mui-checked": {
      color: "#8EC5FF",
    },
  },
};

const radioLabelSx = {
  "& .MuiFormControlLabel-label": {
    color: "#314158",
    fontSize: "14px",
  },
  [DARK_MODE_SELECTOR]: {
    "& .MuiFormControlLabel-label": {
      color: "rgba(255,255,255,0.88)",
    },
  },
};

const ratingButtonSx = (isSelected: boolean) => ({
  py: 1.5,
  fontWeight: 500,
  fontSize: "15px",
  border: "2px solid #d1d5dc",
  bgcolor: isSelected ? "#0069a8" : "white",
  color: isSelected ? "white" : "#020618",
  "&:hover": {
    border: "2px solid #0069a8",
    bgcolor: isSelected ? "#0052a3" : "#f8fafc",
  },
  [DARK_MODE_SELECTOR]: {
    borderColor: isSelected ? "#51A2FF" : "#71717a",
    bgcolor: isSelected ? "#8EC5FF" : "rgba(63,63,71,0.4)",
    color: isSelected ? "#111827" : "#fafafa",
    "&:hover": {
      borderColor: "#8EC5FF",
      bgcolor: isSelected ? "#7ab8f0" : "rgba(142,197,255,0.12)",
    },
  },
});

const primaryButtonSx = {
  width: "100%",
  py: 1.5,
  bgcolor: "#0069a8",
  color: "white",
  fontWeight: 700,
  fontSize: "15px",
  textTransform: "uppercase",
  mb: 2,
  "&:hover": {
    bgcolor: "#0052a3",
  },
  "&:disabled": {
    bgcolor: "#0069a8",
    opacity: 0.7,
  },
  [DARK_MODE_SELECTOR]: {
    bgcolor: "#8EC5FF",
    color: "#111827",
    "&:hover": {
      bgcolor: "#7ab8f0",
    },
    "&:disabled": {
      bgcolor: "#8EC5FF",
      color: "#111827",
      opacity: 0.7,
    },
  },
};

export default function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    fullName: "",
    email: "",
    allowFollowUp: true,
    feedbackType: "",
    feedbackDescription: "",
    experienceRating: 0,
    completionStatus: "yes",
    deviceType: "",
    supportingFile: null,
    additionalComments: "",
  });

  const [charCounts, setCharCounts] = useState({
    feedbackDescription: 0,
    additionalComments: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = () => {
    let filledFields = 0;
    const totalRequiredFields = 7;

    if (formData.fullName.trim()) filledFields++;
    if (formData.email.trim()) filledFields++;
    if (formData.allowFollowUp !== undefined) filledFields++;
    if (formData.feedbackType) filledFields++;
    if (formData.feedbackDescription.trim()) filledFields++;
    if (formData.experienceRating > 0) filledFields++;
    if (formData.completionStatus) filledFields++;

    return Math.round((filledFields / totalRequiredFields) * 100);
  };

  const progress = calculateProgress();

  const handleInputChange = (
    field: keyof FeedbackFormData,
    value: string | number | boolean | File | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "feedbackDescription" || field === "additionalComments") {
      const strValue = value as string;
      setCharCounts((prev) => ({
        ...prev,
        [field]: strValue.length,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange("supportingFile", file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submissionData = new FormData();

      submissionData.append("fullName", formData.fullName);
      submissionData.append("email", formData.email);
      submissionData.append("allowFollowUp", String(formData.allowFollowUp));
      submissionData.append("feedbackType", formData.feedbackType);
      submissionData.append(
        "feedbackDescription",
        formData.feedbackDescription,
      );
      submissionData.append(
        "experienceRating",
        String(formData.experienceRating),
      );
      submissionData.append("completionStatus", formData.completionStatus);
      submissionData.append("deviceType", formData.deviceType);
      submissionData.append("additionalComments", formData.additionalComments);

      if (formData.supportingFile) {
        submissionData.append("supportingFile", formData.supportingFile);
      }

      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        body: submissionData,
      });

      const responseBody = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        const errorMessage =
          responseBody?.error ||
          responseBody?.message ||
          "Failed to submit feedback";
        throw new Error(`[${response.status}] ${errorMessage}`);
      }

      setIsSubmitted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while submitting";
      setError(errorMessage);
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      allowFollowUp: true,
      feedbackType: "",
      feedbackDescription: "",
      experienceRating: 0,
      completionStatus: "yes",
      deviceType: "",
      supportingFile: null,
      additionalComments: "",
    });
    setCharCounts({
      feedbackDescription: 0,
      additionalComments: 0,
    });
  };

  if (isSubmitted) {
    return <SubmissionConfirmation onSubmitAnother={handleSubmitAnother} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #abcde2 136.47%)",
        py: 4,
        px: 2,
        [DARK_MODE_SELECTOR]: {
          background:
            "linear-gradient(180deg, #27272A 19.9%, rgba(142, 197, 255, 0.40) 141.17%)",
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-3xl mx-auto space-y-6 mt-12"
      >
        <Box sx={sectionCardSx}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#020618",
              mb: 1,
              [DARK_MODE_SELECTOR]: {
                color: "#fafafa",
              },
            }}
          >
            PeterPlate Feedback Form
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#4a5565",
              mb: 2,
              [DARK_MODE_SELECTOR]: {
                color: "#8EC5FF",
              },
            }}
          >
            Help Us Improve PeterPlate
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#6a7282",
              mb: 3,
              lineHeight: 1.5,
              [DARK_MODE_SELECTOR]: {
                color: "rgba(255,255,255,0.7)",
              },
            }}
          >
            We would love to hear your thoughts on PeterPlate. Your feedback
            helps us improve the platform experience, fix issues, and create
            features that better support our users.
          </Typography>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#4a5565",
                  fontWeight: 500,
                  [DARK_MODE_SELECTOR]: {
                    color: "rgba(255,255,255,0.78)",
                  },
                }}
              >
                Form Progress
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#0069a8",
                  fontWeight: 500,
                  [DARK_MODE_SELECTOR]: {
                    color: "#8EC5FF",
                  },
                }}
              >
                {progress}%
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "8px",
                bgcolor: "#e5e7eb",
                borderRadius: "100px",
                overflow: "hidden",
                [DARK_MODE_SELECTOR]: {
                  bgcolor: "rgba(255,255,255,0.14)",
                },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${progress}%`,
                  bgcolor: "#0069a8",
                  transition: "width 0.3s ease",
                  [DARK_MODE_SELECTOR]: {
                    bgcolor: "#8EC5FF",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={sectionCardSx}>
          <Typography variant="h6" sx={sectionTitleSx}>
            Personal Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={labelSx}>
              Full Name <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              variant="outlined"
              size="small"
              sx={inputSx}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={labelSx}>
              Email Address <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              placeholder="your.email@example.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              variant="outlined"
              size="small"
              sx={inputSx}
            />
          </Box>

          <FormControl>
            <FormLabel sx={{ ...labelSx, mb: 1.5 }}>
              Would it be okay for our team to follow up with you if needed?{" "}
              <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <RadioGroup
              row
              value={formData.allowFollowUp ? "yes" : "no"}
              onChange={(e) =>
                handleInputChange("allowFollowUp", e.target.value === "yes")
              }
            >
              <FormControlLabel
                value="yes"
                control={<Radio sx={radioSx} />}
                label="Yes"
                sx={radioLabelSx}
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={radioSx} />}
                label="No"
                sx={radioLabelSx}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={sectionCardSx}>
          <Typography variant="h6" sx={sectionTitleSx}>
            Feedback Details
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={labelSx}>
              What type of feedback would you like to share?{" "}
              <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <Select
              fullWidth
              value={formData.feedbackType}
              onChange={(e) =>
                handleInputChange("feedbackType", e.target.value)
              }
              displayEmpty
              size="small"
              sx={selectSx}
              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
            >
              <MenuItem value="">Select feedback type</MenuItem>
              <MenuItem value="bug">Bug Report</MenuItem>
              <MenuItem value="feature">Feature Request</MenuItem>
              <MenuItem value="improvement">Improvement Suggestion</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </Box>

          <Box>
            <FormLabel sx={labelSx}>
              Please describe your feedback in detail.{" "}
              <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Please provide as much detail as possible..."
              value={formData.feedbackDescription}
              onChange={(e) =>
                handleInputChange("feedbackDescription", e.target.value)
              }
              variant="outlined"
              sx={inputSx}
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6a7282",
                  [DARK_MODE_SELECTOR]: {
                    color: "rgba(255,255,255,0.55)",
                  },
                }}
              >
                {charCounts.feedbackDescription}/1000
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={sectionCardSx}>
          <Typography variant="h6" sx={sectionTitleSx}>
            Additional Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={{ ...labelSx, mb: 1.5 }}>
              How would you rate your overall experience with PeterPlate so far?{" "}
              <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 1.5,
              }}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  onClick={() => handleInputChange("experienceRating", rating)}
                  sx={ratingButtonSx(formData.experienceRating === rating)}
                >
                  {rating}
                </Button>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#6a7282",
                  [DARK_MODE_SELECTOR]: {
                    color: "rgba(255,255,255,0.55)",
                  },
                }}
              >
                Very Poor
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#6a7282",
                  [DARK_MODE_SELECTOR]: {
                    color: "rgba(255,255,255,0.55)",
                  },
                }}
              >
                Excellent
              </Typography>
            </Box>
          </Box>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel sx={{ ...labelSx, mb: 1.5 }}>
              Were you able to complete what you intended to do in the platform?{" "}
              <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <RadioGroup
              row
              value={formData.completionStatus}
              onChange={(e) =>
                handleInputChange("completionStatus", e.target.value)
              }
            >
              <FormControlLabel
                value="yes"
                control={<Radio sx={radioSx} />}
                label="Yes"
                sx={radioLabelSx}
              />
              <FormControlLabel
                value="partially"
                control={<Radio sx={radioSx} />}
                label="Partially"
                sx={radioLabelSx}
              />
              <FormControlLabel
                value="no"
                control={<Radio sx={radioSx} />}
                label="No"
                sx={radioLabelSx}
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={labelSx}>
              What device are you using? (optional)
            </FormLabel>
            <Select
              fullWidth
              value={formData.deviceType}
              onChange={(e) => handleInputChange("deviceType", e.target.value)}
              displayEmpty
              size="small"
              sx={selectSx}
              MenuProps={{ PaperProps: { sx: menuPaperSx } }}
            >
              <MenuItem value="">Select device type</MenuItem>
              <MenuItem value="desktop">Desktop</MenuItem>
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormLabel sx={labelSx}>
              Upload a screenshot or supporting file (optional)
            </FormLabel>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{
                py: 1.5,
                border: "2px dashed #d1d5dc",
                color: "#6a7282",
                textTransform: "capitalize",
                bgcolor: "rgba(255,255,255,0.6)",
                "&:hover": {
                  border: "2px dashed #0069a8",
                  bgcolor: "#f8fafc",
                },
                [DARK_MODE_SELECTOR]: {
                  borderColor: "#71717a",
                  bgcolor: "rgba(63,63,71,0.4)",
                  color: "rgba(255,255,255,0.72)",
                  "&:hover": {
                    borderColor: "#8EC5FF",
                    bgcolor: "rgba(142,197,255,0.12)",
                  },
                },
              }}
            >
              {formData.supportingFile
                ? "Replace uploaded file"
                : "Click to upload file"}
              <input
                hidden
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </Button>
            <Typography
              sx={{
                mt: 1,
                fontSize: "12px",
                color: formData.supportingFile ? "#0069a8" : "#6a7282",
                [DARK_MODE_SELECTOR]: {
                  color: formData.supportingFile
                    ? "#8EC5FF"
                    : "rgba(255,255,255,0.55)",
                },
              }}
            >
              {formData.supportingFile
                ? `Selected file: ${formData.supportingFile.name}`
                : "Attach a screenshot, image, or PDF to provide extra context."}
            </Typography>
          </Box>

          <Box>
            <FormLabel sx={labelSx}>
              Any additional comments or suggestions? (optional)
            </FormLabel>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Any other thoughts you'd like to share..."
              value={formData.additionalComments}
              onChange={(e) =>
                handleInputChange("additionalComments", e.target.value)
              }
              variant="outlined"
              sx={inputSx}
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6a7282",
                  [DARK_MODE_SELECTOR]: {
                    color: "rgba(255,255,255,0.55)",
                  },
                }}
              >
                {charCounts.additionalComments}/1000
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", pb: 4 }}>
          {error && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "#fee2e2",
                border: "1px solid #fecaca",
                borderRadius: 1.5,
                color: "#dc2626",
                [DARK_MODE_SELECTOR]: {
                  bgcolor: "rgba(127,29,29,0.28)",
                  borderColor: "rgba(248,113,113,0.5)",
                  color: "#fecaca",
                },
              }}
            >
              <Typography sx={{ fontSize: "14px" }}>{error}</Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={primaryButtonSx}
          >
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
          <Typography
            sx={{
              fontSize: "15px",
              color: "#4a5565",
              mt: 2,
              [DARK_MODE_SELECTOR]: {
                color: "rgba(255,255,255,0.68)",
              },
            }}
          >
            By submitting to this form, you agree to let us use your feedback to
            improve PeterPlate.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SubmissionConfirmation({
  onSubmitAnother,
}: {
  onSubmitAnother: () => void;
}) {
  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #abcde2 136.47%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        overflow: "hidden",
        [DARK_MODE_SELECTOR]: {
          background:
            "linear-gradient(180deg, #27272A 19.9%, rgba(142, 197, 255, 0.40) 141.17%)",
        },
      }}
    >
      <Box
        sx={{
          ...sectionCardSx,
          p: { xs: 3, sm: 4 },
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <CheckCircle
            sx={{
              fontSize: 60,
              color: "#008236",
              mx: "auto",
            }}
          />
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#020618",
            mb: 1,
            [DARK_MODE_SELECTOR]: {
              color: "#fafafa",
            },
          }}
        >
          Thank You!
        </Typography>

        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#4a5565",
            mb: 2,
            [DARK_MODE_SELECTOR]: {
              color: "#8EC5FF",
            },
          }}
        >
          Thank you for helping improve PeterPlate.
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#6a7282",
            lineHeight: 1.5,
            mb: 3,
            [DARK_MODE_SELECTOR]: {
              color: "rgba(255,255,255,0.7)",
            },
          }}
        >
          Your feedback has been submitted successfully. We will review it
          carefully and use it to make PeterPlate better for everyone.
        </Typography>

        <Button
          onClick={onSubmitAnother}
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: "#0069a8",
            color: "white",
            fontWeight: 500,
            fontSize: "15px",
            textTransform: "capitalize",
            "&:hover": {
              bgcolor: "#0052a3",
            },
            [DARK_MODE_SELECTOR]: {
              bgcolor: "#8EC5FF",
              color: "#111827",
              "&:hover": {
                bgcolor: "#7ab8f0",
              },
            },
          }}
        >
          Submit Another Response
        </Button>
      </Box>
    </Box>
  );
}
