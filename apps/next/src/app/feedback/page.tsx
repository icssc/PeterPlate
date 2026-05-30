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
import { useState } from "react";

type FeedbackFormData = {
  fullName: string;
  email: string;
  allowFollowUp: boolean;
  feedbackType: string;
  feedbackDescription: string;
  experienceRating: number;
  completionStatus: string;
  deviceType: string;
  supportingFile: File | null;
  additionalComments: string;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
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
        background: "linear-gradient(to bottom, #ffffff, #abcde2 136.47%)",
        py: 4,
        px: 2,
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6 mt-12">
        {/* Header Card */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow:
              "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#020618",
              mb: 1,
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
            }}
          >
            We would love to hear your thoughts on PeterPlate. Your feedback
            helps us improve the platform experience, fix issues, and create
            features that better support our users.
          </Typography>

          {/* Progress Indicator */}
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
                sx={{ fontSize: "12px", color: "#4a5565", fontWeight: 500 }}
              >
                Form Progress
              </Typography>
              <Typography
                sx={{ fontSize: "12px", color: "#0069a8", fontWeight: 500 }}
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
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${progress}%`,
                  bgcolor: "#0069a8",
                  transition: "width 0.3s ease",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Personal Information Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow:
              "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#0f172b" }}
          >
            Personal Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
              Full Name <span style={{ color: "#fb2c36" }}>*</span>
            </FormLabel>
            <TextField
              fullWidth
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
            />
          </Box>

          <FormControl>
            <FormLabel
              sx={{
                mb: 1.5,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Feedback Details Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow:
              "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#0f172b" }}
          >
            Feedback Details
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
            >
              <MenuItem value="">Select feedback type</MenuItem>
              <MenuItem value="bug">Bug Report</MenuItem>
              <MenuItem value="feature">Feature Request</MenuItem>
              <MenuItem value="improvement">Improvement Suggestion</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 0 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
              inputProps={{ maxLength: 1000 }}
              variant="outlined"
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Typography sx={{ fontSize: "12px", color: "#6a7282" }}>
                {charCounts.feedbackDescription}/1000
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Additional Information Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow:
              "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "#0f172b" }}
          >
            Additional Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1.5,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
                  onClick={() => handleInputChange("experienceRating", rating)}
                  sx={{
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: "15px",
                    textTransform: "uppercase",
                    border: "2px solid #d1d5dc",
                    bgcolor:
                      formData.experienceRating === rating
                        ? "#0069a8"
                        : "white",
                    color:
                      formData.experienceRating === rating ? "white" : "black",
                    "&:hover": {
                      border: "2px solid #0069a8",
                    },
                  }}
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
              <Typography sx={{ fontSize: "11px", color: "#6a7282" }}>
                Very Poor
              </Typography>
              <Typography sx={{ fontSize: "11px", color: "#6a7282" }}>
                Excellent
              </Typography>
            </Box>
          </Box>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                mb: 1.5,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel
                value="partially"
                control={<Radio />}
                label="Partially"
              />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
              What device are you using? (optional)
            </FormLabel>
            <Select
              fullWidth
              value={formData.deviceType}
              onChange={(e) => handleInputChange("deviceType", e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">Select device type</MenuItem>
              <MenuItem value="desktop">Desktop</MenuItem>
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="tablet">Tablet</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
                "&:hover": {
                  border: "2px dashed #0069a8",
                },
              }}
            >
              Click to upload file
              <input hidden type="file" onChange={handleFileChange} />
            </Button>
          </Box>

          <Box sx={{ mb: 0 }}>
            <FormLabel
              sx={{
                display: "block",
                mb: 1,
                fontSize: "14px",
                fontWeight: 500,
                color: "#314158",
              }}
            >
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
              slotProps={{
                htmlInput: {
                  maxLength: 1000,
                },
              }}
            />
            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Typography sx={{ fontSize: "12px", color: "#6a7282" }}>
                {charCounts.additionalComments}/1000
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Submit Button and Footer */}
        <Box sx={{ textAlign: "center", pb: 4 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
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
            }}
          >
            Submit Feedback
          </Button>
          <Typography sx={{ fontSize: "15px", color: "#4a5565", mt: 2 }}>
            By submitting to this form, you agree to let us use your feedback to
            improve PeterPlate.
          </Typography>
        </Box>
      </div>
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
        background: "linear-gradient(to bottom, #ffffff, #abcde2 136.47%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          boxShadow:
            "0px 10px 7.5px rgba(0,0,0,0.1), 0px 4px 3px rgba(0,0,0,0.1)",
          p: 4,
          maxWidth: 600,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Checkmark Icon */}
        <Box sx={{ mb: 3 }}>
          <CheckCircle
            sx={{
              fontSize: 60,
              color: "#008236",
              mx: "auto",
            }}
          />
        </Box>

        {/* Heading */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#020618",
            mb: 1,
          }}
        >
          Thank You!
        </Typography>

        {/* Subheading */}
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#4a5565",
            mb: 2,
          }}
        >
          Thank you for helping improve PeterPlate.
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: "14px",
            color: "#6a7282",
            lineHeight: 1.5,
            mb: 3,
          }}
        >
          Your feedback has been submitted successfully. We will review it
          carefully and use it to make PeterPlate better for everyone.
        </Typography>

        {/* Submit Another Button */}
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
          }}
        >
          Submit Another Response
        </Button>
      </Box>
    </Box>
  );
}
