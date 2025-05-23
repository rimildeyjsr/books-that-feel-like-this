"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import { Stack, Button, Box } from "@mui/material";
import { ImageUploader } from "@/components/ImageUploader";
import { PromptInput } from "@/components/PromptInput";
import { FormValues } from "@/types/form";
import { formValidationSchema } from "@/schemas/validationSchema";

const initialValues: FormValues = {
  prompt: "",
  images: [],
};

export default function Home() {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    try {
      console.log("Submitting:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Your actual submission logic here
      // await submitBookRequest(values);

      // Clean up blob URLs
      values.images.forEach((image) => URL.revokeObjectURL(image.url));

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack alignItems="center" gap={3} margin={2}>
      <h1>Books that feel like this!</h1>

      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          {({ isSubmitting, isValid, dirty, submitForm }) => (
            <Form>
              <Field
                name="prompt"
                component={PromptInput}
                onSubmit={submitForm}
              />

              <Field
                name="images"
                component={ImageUploader}
                disabled={isSubmitting}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!isValid || isSubmitting}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? "Finding Books..." : "Find Books"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Stack>
  );
}
