import * as Yup from "yup";

export const formValidationSchema = Yup.object({
  prompt: Yup.string().max(1000, "Prompt must be less than 1000 characters"),
  images: Yup.array().min(1, "At least one image is required"),
});
