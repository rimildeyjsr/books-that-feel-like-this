import { UploadedImage } from "@/types/image";

export interface FormValues {
  prompt: string;
  images: UploadedImage[];
}
