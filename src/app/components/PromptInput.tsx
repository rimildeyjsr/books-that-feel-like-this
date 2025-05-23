import React, { useState, useCallback } from "react";
import { TextField, Box } from "@mui/material";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  maxLength?: number;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSubmit,
  placeholder = "Enter your prompt...",
  label = "Prompt",
  multiline = true,
  rows = 3,
  disabled = false,
  fullWidth = true,
  variant = "outlined",
  maxLength = 1000,
}) => {
  const [value, setValue] = useState<string>("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue.length <= maxLength) {
        setValue(newValue);
      }
    },
    [maxLength],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !multiline) {
        event.preventDefault();
        if (value.trim()) {
          onSubmit(value.trim());
          setValue("");
        }
      }

      if (event.key === "Enter" && event.ctrlKey && multiline) {
        event.preventDefault();
        if (value.trim()) {
          onSubmit(value.trim());
          setValue("");
        }
      }
    },
    [value, onSubmit, multiline],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        label={label}
        multiline={multiline}
        rows={multiline ? rows : 1}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        helperText={
          multiline
            ? `${value.length}/${maxLength} characters • Ctrl+Enter to submit`
            : `${value.length}/${maxLength} characters • Enter to submit`
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />
    </Box>
  );
};
