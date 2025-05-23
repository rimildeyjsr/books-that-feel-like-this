import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  type Part,
} from "@google/genai";

interface GenerateContentParams {
  prompt: string;
  images: File[];
}

interface GenerateContentResponse {
  text: string;
}

const SYSTEM_PROMPT =
  "Can you help me find books based on the images and/or the user prompt? They must be real books and match the vibes of the image. Can you keep your responses short and provide links to the books on goodreads?";

const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_API_KEY environment variable is required",
    );
  }
  return apiKey;
};

const ai = new GoogleGenAI({
  apiKey: getApiKey(),
});

const convertFileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const uploadFile = async (file: File) => {
  return ai.files.upload({
    file: file,
    config: {
      mimeType: file.type,
      displayName: file.name,
    },
  });
};

export const generateBookRecommendations = async (
  params: GenerateContentParams,
): Promise<GenerateContentResponse> => {
  const { prompt, images } = params;

  if (images.length === 0) {
    throw new Error("At least one image is required");
  }

  try {
    const enhancedPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`;
    const contentParts: (string | Part)[] = [enhancedPrompt];

    for (const [index, image] of images.entries()) {
      if (index === 0 && images.length > 1) {
        const uploadedFile = await uploadFile(image);
        contentParts.push(
          createPartFromUri(
            uploadedFile.uri as string,
            uploadedFile.mimeType as string,
          ),
        );
      } else {
        const base64Data = await convertFileToBase64(image);
        contentParts.push({
          inlineData: {
            mimeType: image.type,
            data: base64Data,
          },
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent(contentParts),
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from API");
    }

    return { text };
  } catch (error) {
    console.error("GenAI API Error:", error);
    throw new Error("Failed to generate book recommendations");
  }
};
