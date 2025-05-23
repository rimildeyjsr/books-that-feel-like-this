import React, { useCallback } from "react";
import { FieldProps } from "formik";

interface PromptInputProps extends FieldProps {
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  onSubmit?: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  field,
  form,
  placeholder = "Dark academia vibes, cozy mystery, ethereal fantasy...",
  label = "Describe what you're looking for",
  multiline = true,
  rows = 3,
  disabled = false,
  fullWidth = true,
  maxLength = 1000,
  onSubmit,
}) => {
  const hasError = form.touched[field.name] && !!form.errors[field.name];
  const errorMessage = hasError
    ? (form.errors[field.name] as string)
    : undefined;

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      if (newValue.length <= maxLength) {
        field.onChange(event);
      }
    },
    [field, maxLength],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && event.ctrlKey && multiline) {
        event.preventDefault();
        onSubmit?.();
      }
    },
    [onSubmit, multiline],
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      field.onBlur(event);
    },
    [field],
  );

  return (
    <div
      className={`bg-white rounded-3xl p-8 shadow-sm border ${hasError ? "border-red-200" : "border-gray-100"}`}
    >
      <label className="block text-base font-medium text-gray-900 mb-6">
        {label}
        <span className="text-gray-500 font-normal ml-2">Optional</span>
      </label>
      <textarea
        {...field}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full p-0 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 resize-none text-lg leading-relaxed bg-transparent"
      />
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
        <span className="text-sm text-gray-400">
          {field.value.length}/{maxLength} characters
        </span>
        {errorMessage && (
          <span className="text-sm text-red-600">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
