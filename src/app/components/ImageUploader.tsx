import React, { useState, useCallback } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Typography,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { CloudUpload, Delete, Image as ImageIcon } from "@mui/icons-material";
import { UploadedImage } from "@/types/image";
import { ImagePreviewModal } from "@/components/ImagePreviewModal";
import { FieldProps } from "formik";

interface ImageUploaderProps extends FieldProps {
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  field,
  form,
  disabled = false,
}) => {
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const images: UploadedImage[] = field.value || [];
  const hasError = form.touched[field.name] && !!form.errors[field.name];
  const errorMessage = hasError
    ? (form.errors[field.name] as string)
    : undefined;

  const validateFile = (file: File): boolean => {
    const maxSize = 50 * 1024 * 1024;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload only image files (JPEG, PNG, GIF, WebP)");
      return false;
    }

    if (file.size > maxSize) {
      setUploadError("File size must be less than 50MB");
      return false;
    }

    return true;
  };

  const processFiles = useCallback(
    (files: FileList) => {
      setUploadError(null);
      const newImages: UploadedImage[] = [];

      Array.from(files).forEach((file) => {
        if (validateFile(file)) {
          const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const url = URL.createObjectURL(file);

          newImages.push({
            id,
            file,
            url,
            name: file.name,
            size: file.size,
          });
        }
      });

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        form.setFieldValue(field.name, updatedImages);
        form.setFieldTouched(field.name, true);
        // Force validation after state update
        setTimeout(() => {
          form.validateField(field.name);
        }, 0);
      }
    },
    [images, form, field.name],
  );

  const deleteImage = useCallback(
    (id: string) => {
      const imageToDelete = images.find((img) => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }

      const updatedImages = images.filter((img) => img.id !== id);
      form.setFieldValue(field.name, updatedImages);
      form.setFieldTouched(field.name, true);
      // Force validation after state update
      setTimeout(() => {
        form.validateField(field.name);
      }, 0);
    },
    [images, form, field.name],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || disabled) return;
      processFiles(files);
      event.target.value = "";
    },
    [processFiles, disabled],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const files = event.dataTransfer.files;
      processFiles(files);
    },
    [processFiles, disabled],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    [],
  );

  const openPreview = useCallback((image: UploadedImage) => {
    setPreviewImage(image);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const displayError = uploadError || errorMessage;

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
      {displayError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {displayError}
        </Alert>
      )}

      <Paper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        elevation={isDragOver ? 8 : 2}
        sx={{
          border: 2,
          borderColor: hasError
            ? "error.main"
            : isDragOver
              ? "primary.main"
              : "primary.light",
          borderStyle: "dashed",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          mb: 3,
          cursor: disabled ? "not-allowed" : "pointer",
          bgcolor: disabled
            ? "action.disabledBackground"
            : isDragOver
              ? "primary.50"
              : "grey.50",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.2s ease-in-out",
          ...(!disabled && {
            "&:hover": {
              bgcolor: "primary.50",
              borderColor: hasError ? "error.main" : "primary.main",
            },
          }),
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="file-upload"
          multiple
          type="file"
          onChange={handleFileUpload}
          disabled={disabled}
        />
        <label htmlFor="file-upload">
          <IconButton
            color="primary"
            component="span"
            size="large"
            sx={{ mb: 2 }}
            disabled={disabled}
          >
            <CloudUpload sx={{ fontSize: 48 }} />
          </IconButton>
          <Typography variant="h6" gutterBottom color="primary">
            Drop images here or click to upload
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports JPEG, PNG, GIF, WebP (max 50MB each)
          </Typography>
        </label>
      </Paper>

      {images.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Uploaded Images ({images.length})
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {images.map((image) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                      "& .delete-button": {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => openPreview(image)}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={image.url}
                      alt={image.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <IconButton
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(image.id);
                      }}
                      disabled={disabled}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        opacity: 0,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 1)",
                          transform: "scale(1.1)",
                        },
                      }}
                      size="small"
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Box>
                  <Box sx={{ p: 1 }}>
                    <Typography variant="caption" noWrap color="text.secondary">
                      {image.name}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {images.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 6,
            color: "text.secondary",
          }}
        >
          <ImageIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">No images uploaded yet</Typography>
        </Box>
      )}

      <ImagePreviewModal
        open={!!previewImage}
        image={previewImage}
        onClose={closePreview}
        onDelete={deleteImage}
      />
    </Box>
  );
};
