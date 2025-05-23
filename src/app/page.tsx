"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Typography } from "@mui/material";
import { BookOpen, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-8">
            <BookOpen className="w-8 h-8 text-gray-800" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
            Find Books That Match Your Aesthetic
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            Upload images that capture a feeling or mood. Discover books that
            resonate with that same energy.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={formValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          {({ isSubmitting, isValid, dirty, submitForm, values }) => (
            <Form className="space-y-12">
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
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    isLoading ||
                    !hasValidImages(values)
                  }
                  className={`inline-flex items-center px-8 py-4 rounded-full font-medium transition-all duration-200 ${
                    !isValid ||
                    isSubmitting ||
                    isLoading ||
                    !hasValidImages(values)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md active:scale-95"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Finding recommendations...
                    </>
                  ) : (
                    <>
                      Find Books
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {recommendations && (
          <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <Typography
                variant="h5"
                component="h2"
                className="text-2xl font-semibold text-gray-900"
              >
                Recommendations
              </Typography>
            </div>
            <div className="p-8">
              <div className="prose prose-gray max-w-none">
                <Typography
                  variant="body1"
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base"
                >
                  {recommendations}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
