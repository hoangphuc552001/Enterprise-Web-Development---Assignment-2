import { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { uploadFileToS3 } from "../api/user-api";

interface PosterUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

type UploadStatus = "idle" | "uploading" | "done" | "error";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

const PosterUpload = ({ value, onChange, error }: PosterUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<UploadStatus>(value ? "done" : "idle");
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<string>(value);

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    setUploadError("");
    setPreview(URL.createObjectURL(file));
    setStatus("uploading");

    try {
      const url = await uploadFileToS3(file);
      onChange(url);
      setPreview(url);
      setStatus("done");
    } catch {
      setStatus("error");
      setUploadError("Upload failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const displayError = uploadError || error;

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" color="text.secondary">
        Poster Image
      </Typography>

      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => status !== "uploading" && inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: displayError ? "error.main" : "divider",
          borderRadius: 1,
          p: 2,
          minHeight: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          cursor: status === "uploading" ? "not-allowed" : "pointer",
          bgcolor: "background.paper",
          transition: "border-color 0.2s",
          "&:hover": {
            borderColor: status === "uploading" ? "divider" : "primary.main",
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {preview && (
          <Box
            component="img"
            src={preview}
            alt="Poster preview"
            sx={{
              maxHeight: 180,
              maxWidth: "100%",
              borderRadius: 0.5,
              objectFit: "contain",
            }}
          />
        )}

        {status === "uploading" && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.75)",
            }}
          >
            <CircularProgress size={36} />
          </Box>
        )}

        {!preview && status !== "uploading" && (
          <>
            <CloudUploadIcon color="action" sx={{ fontSize: 40 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Drag & drop an image here, or click to browse
            </Typography>
            <Typography variant="caption" color="text.disabled">
              JPEG / PNG / WebP / GIF - max {MAX_SIZE_MB} MB
            </Typography>
          </>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Button
          size="small"
          variant="outlined"
          disabled={status === "uploading"}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {preview ? "Change image" : "Browse"}
        </Button>

        {status === "done" && (
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="caption" color="success.main">
              Uploaded
            </Typography>
          </Stack>
        )}
      </Stack>

      {displayError && <FormHelperText error>{displayError}</FormHelperText>}
    </Stack>
  );
};

export default PosterUpload;
