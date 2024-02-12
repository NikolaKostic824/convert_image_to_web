import { validateImage } from "./validationModule.js";

// Function to calculate aspect ratio based on width and height
export const calculateAspectRatio = ({ width, height }) =>
  (100 * height) / width;

// Function to calculate height based on width and aspect ratio
export const calculateHeight = (width, aspectRatio) =>
  (width * aspectRatio) / 100;

// Alert function for displaying invalid data
export const alertInvalidData = (data) => {
  // Extracts names of invalid data and joins them into a string
  const invalidDataNames = data
    .map((data) => (data ? data.name : "Unknown"))
    .join(", ");
  // Displays alert with names of invalid data
  alert(
    `Some images are invalid: ${invalidDataNames}. Please make sure all images are valid and try again.`
  );
};

// Function to create an invalid object
export const createInvalidObject = (file) => {
  return { valid: false, name: file.name };
};

// Function to create an image object
export const createImageObj = (file, img) => {
  // Validates image file name
  const validationResult = validateImage(file.name);
  // Extracts name without extension if image is valid
  const name = validationResult.isValid
    ? file.name.substring(0, file.name.lastIndexOf("."))
    : null;
  // Creates image object with various properties
  return {
    isValid: validationResult.isValid,
    name: name,
    dimensions: { width: img.width, height: img.height },
    size: file.size,
    src: URL.createObjectURL(file),
    extension: file.name.split(".").pop(),
    type: validationResult.type,
  };
};
