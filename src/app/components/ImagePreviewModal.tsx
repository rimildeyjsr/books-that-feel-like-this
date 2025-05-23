import React from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { UploadedImage } from "@/types/image";

interface ImagePreviewModalProps {
  open: boolean;
  image: UploadedImage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  image,
  onClose,
  onDelete,
}) => {
  const handleDelete = () => {
    if (image) {
      onDelete(image.id);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          maxWidth: "90vw",
          maxHeight: "90vh",
          outline: "none",
        }}
      >
        {image && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                noWrap
                sx={{ flex: 1, mr: 2 }}
              >
                {image.name}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                  size="small"
                >
                  Delete
                </Button>
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box
                component="img"
                src={image.url}
                alt={image.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`${(image.size / 1024 / 1024).toFixed(2)} MB`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
