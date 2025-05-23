import React, { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";
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
      setUploadError("Only image files are supported");
      return false;
    }

    if (file.size > maxSize) {
      setUploadError("File size must be under 50MB");
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
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-gray-900">Visual Inspiration</h2>

      {displayError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-800 text-sm">{displayError}</p>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative bg-white border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ${
          disabled
            ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
            : isDragOver
              ? "border-gray-400 bg-gray-50"
              : hasError
                ? "border-red-200 hover:border-red-300"
                : "border-gray-200 hover:border-gray-300"
        }`}
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
        <label htmlFor="file-upload" className="cursor-pointer">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${
              disabled ? "bg-gray-100" : hasError ? "bg-red-100" : "bg-gray-100"
            }`}
          >
            <Plus
              className={`w-6 h-6 ${
                disabled
                  ? "text-gray-400"
                  : hasError
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            />
          </div>

          <h3
            className={`text-lg font-medium mb-2 ${
              disabled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            Add Images
          </h3>
          <p className="text-gray-500 mb-4">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-gray-400">
            JPEG, PNG, GIF, WebP up to 50MB
          </p>
        </label>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => openPreview(image)}
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteImage(image.id);
                }}
                disabled={disabled}
                className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm disabled:opacity-30"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ImagePreviewModal
        open={!!previewImage}
        image={previewImage}
        onClose={closePreview}
        onDelete={deleteImage}
        disabled={disabled}
      />
    </div>
  );
};
