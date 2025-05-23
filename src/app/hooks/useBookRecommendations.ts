import { useState } from "react";
import { generateBookRecommendations } from "@/services/genai";
import { FormValues } from "@/types/form";

interface UseBookRecommendationsReturn {
  generateRecommendations: (values: FormValues) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export const useBookRecommendations = (): UseBookRecommendationsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecommendations = async (
    values: FormValues,
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const imageFiles = values.images.map((imageData) => {
        // Convert blob URL back to File if needed
        if (imageData.file) {
          return imageData.file;
        }
        throw new Error("Invalid image data");
      });

      const response = await generateBookRecommendations({
        prompt: values.prompt,
        images: imageFiles,
      });

      return response.text;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateRecommendations,
    isLoading,
    error,
  };
};
