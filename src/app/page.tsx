"use client";
import ImageUploader from "@/components/ImageUploader";
import { Stack } from "@mui/material";
import { PromptInput } from "@/components/PromptInput";

export default function Home() {
  return (
    <Stack alignItems="center" gap={2} margin={2}>
      <h1>Books that feel like this!</h1>

      <PromptInput onSubmit={() => {}} />
      <ImageUploader />
    </Stack>
  );
}
