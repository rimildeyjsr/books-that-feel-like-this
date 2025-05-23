"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Box, Alert, Typography, Paper } from "@mui/material";
import { ImageUploader } from "@/components/ImageUploader";
import { PromptInput } from "@/components/PromptInput";
import { FormValues } from "@/types/form";
import { formValidationSchema } from "@/schemas/validationSchema";
import { useBookRecommendations } from "@/hooks/useBookRecommendations";

const initialValues: FormValues = {
  prompt: "",
  images: [],
};

export default function Home() {
  const [recommendations, setRecommendations] = useState<string>("");
  const { generateRecommendations, isLoading, error } =
    useBookRecommendations();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      const result = await generateRecommendations(values);
      setRecommendations(result);

      // Clean up blob URLs
      values.images.forEach((image) => URL.revokeObjectURL(image.url));

      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const hasValidImages = (values: FormValues) => values.images.length > 0;

  return (
    <Stack alignItems="center" gap={3} margin={2}>
      <Typography variant="h3" component="h1" textAlign="center">
        Books that feel like this!
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          {({ isSubmitting, isValid, dirty, submitForm, values }) => (
            <Form>
              <Field
                name="prompt"
                component={PromptInput}
                onSubmit={submitForm}
              />

              <Field
                name="images"
                component={ImageUploader}
                disabled={isSubmitting || isLoading}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    isLoading ||
                    !hasValidImages(values)
                  }
                  sx={{ minWidth: 200 }}
                >
                  {isLoading ? "Finding Books..." : "Find Books"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        {recommendations && (
          <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Book Recommendations
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {recommendations}
            </Typography>
          </Paper>
        )}
      </Box>
    </Stack>
  );
}
