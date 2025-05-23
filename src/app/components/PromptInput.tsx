import React, { useCallback } from "react";
import { TextField, Box } from "@mui/material";
import { FieldProps } from "formik";

interface PromptInputProps extends FieldProps {
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  maxLength?: number;
  onSubmit?: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  field,
  form,
  placeholder = "Enter your prompt...",
  label = "Prompt (Optional)",
  multiline = true,
  rows = 3,
  disabled = false,
  fullWidth = true,
  variant = "outlined",
  maxLength = 1000,
  onSubmit,
}) => {
  const hasError = form.touched[field.name] && !!form.errors[field.name];
  const errorMessage = hasError
    ? (form.errors[field.name] as string)
    : undefined;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (newValue.length <= maxLength) {
        field.onChange(event);
      }
    },
    [field, maxLength],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !multiline) {
        event.preventDefault();
        onSubmit?.();
      }

      if (event.key === "Enter" && event.ctrlKey && multiline) {
        event.preventDefault();
        onSubmit?.();
      }
    },
    [onSubmit, multiline],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      field.onBlur(event);
    },
    [field],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        {...field}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        label={label}
        multiline={multiline}
        rows={multiline ? rows : 1}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        error={hasError}
        helperText={
          errorMessage ||
          (multiline
            ? `${field.value.length}/${maxLength} characters • Ctrl+Enter to submit`
            : `${field.value.length}/${maxLength} characters • Enter to submit`)
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: hasError ? "error.main" : "primary.main",
            },
          },
        }}
      />
    </Box>
  );
};
