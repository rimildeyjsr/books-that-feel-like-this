import React from "react";
import { X, Trash2 } from "lucide-react";
import { UploadedImage } from "@/types/image";

interface ImagePreviewModalProps {
  open: boolean;
  image: UploadedImage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  image,
  onClose,
  onDelete,
  disabled = false,
}) => {
  if (!open || !image) return null;

  const handleDelete = () => {
    onDelete(image.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 truncate flex-1 mr-4">
            {image.name}
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {(image.size / 1024 / 1024).toFixed(1)} MB
            </span>
            <button
              onClick={handleDelete}
              disabled={disabled}
              className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-auto max-h-[60vh] object-contain rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};
