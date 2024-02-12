// Importing necessary functions and modules
import { getAllowedTypes } from "./settingsModule.js";
import { alertInvalidData } from "./helpersModule.js";

/**
 * Function to validate the extension of an image file.
 * @param {string} fileName - Name of the image file.
 * @returns {boolean} - True if the extension is valid, false otherwise.
 */
export const validateImageExtension = (fileName) => {
  // Get allowed image types from settings module
  const allowedTypes = getAllowedTypes();
  // Extract file extension from file name
  const extension = fileName.split(".").pop();
  // Check if file name has only one dot (indicating a valid extension)
  const isValidName = fileName.split(".").length === 2;
  // Check if extension is included in the allowed types
  const isValidType = allowedTypes.includes(extension);
  // Return true if both name and type are valid
  return isValidName && isValidType;
};

/**
 * Function to validate the name of an image file.
 * @param {string} fileName - Name of the image file.
 * @returns {Object} - Object containing boolean values indicating whether the name indicates background or left-right type.
 */
const validateImageName = (fileName) => {
  // Regular expressions to check for "background" or "left-right" in the file name
  const isBackground = /background|back/i.test(fileName);
  const isLeftOrRight = /left|right/i.test(fileName);
  return { isBackground, isLeftOrRight };
};

/**
 * Function to validate an image file.
 * @param {string} fileName - Name of the image file.
 * @returns {Object} - Object containing a boolean value indicating whether the image is valid, and the type of the image.
 */
export const validateImage = (fileName) => {
  // Validate the file extension
  const isValid = validateImageExtension(fileName);
  // Validate the file name for background and left-right types
  const { isBackground, isLeftOrRight } = validateImageName(fileName);
  // Return an object with validity and type information
  return {
    isValid: isValid && (isBackground || isLeftOrRight),
    type: isBackground ? "background" : isLeftOrRight ? "left-right" : null,
  };
};

/**
 * Function to filter out invalid images.
 * @param {Object[]} images - Array of image data objects.
 * @returns {Object[]} - Array containing only valid image data objects.
 */
export const filterInvalidImages = (images) => {
  // Filter out valid and invalid images
  const validImages = images.filter((imageData) => imageData.isValid);
  const invalidImages = images.filter((imageData) => !imageData.isValid);
  // Alert user about invalid images
  alertInvalidData(invalidImages);
  // Reload the page if there are no valid images
  if (validImages.length == 0) {
    location.reload();
    return null;
  }
  return validImages;
};

/**
 * Function to validate the format of a URL.
 * @param {string} imageUrl - URL of the image.
 * @returns {boolean} - True if the URL has a valid format, false otherwise.
 */
export const validateImageUrl = (imageUrl) => {
  return imageUrl.startsWith("https://") || imageUrl.startsWith("http://");
};
