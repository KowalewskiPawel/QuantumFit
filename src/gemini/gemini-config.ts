import { GoogleGenerativeAI } from "@google/generative-ai";

type imageProps = {
  path: string;
  mimeType: string;
};
const apiKey=process.env.GEMINI_API_KEY
const geminiAI = new GoogleGenerativeAI(apiKey);

// function will probably need to be adjusted to work depending on where we get the images from
const fileToGenerativePart = async (url) => {
  const fetchedImage = await fetch(url);
  const file = await fetchedImage.blob();
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const askGeminiText = async (question: string) => {
  const model = geminiAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(question);

  return {
    response: result.response,
    text: result.response.text(),
  };
};

export const askGeminiVision = async (
  question: string,
  images: string[]
) => {
  const model = geminiAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const imageParts = await Promise.all([...images].map(fileToGenerativePart));

  // will need to be adjusted based on image location
  const result = await model.generateContent([question, ...imageParts]);
  return {
    response: result.response,
    text: result.response.text(),
  };
};

/** https://ai.google.dev/tutorials/web_quickstart#generate-text-from-text-and-image-input */

/**
 * Image requirements for questions
 * Prompts that use image data are subject to the following limitations and requirements:
 *
 * Images must be in one of the following image data MIME types:
 * PNG - image/png
 * JPEG - image/jpeg
 * WEBP - image/webp
 * HEIC - image/heic
 * HEIF - image/heif
 *
 * Maximum of 16 individual images
 * Maximum of 4MB for the entire prompt, including images and text
 * No specific limits to the number of pixels in an image; however, larger images are scaled
 * down to fit a maximum resolution of 3072 x 3072 while preserving their original aspect ratio.
 *
 * When using images in your prompt, follow these recommendations for best results:
 *
 * Prompts with a single image tend to yield better results.
 */
