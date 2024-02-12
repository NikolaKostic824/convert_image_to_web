import { filterInvalidImages } from "./validationModule.js";
import {
  loadImageData,
  loadUrlImageData,
  resizeAndConvertImage,
} from "./imageEngineModule.js";
import { downloadZipArchive } from "./zipModule.js";

/**
 * Function to get images from file input, resize and convert them, and download as a zip archive.
 * @param {FileList} files - List of files selected from file input.
 * @returns {Promise<File[]>} - Array of converted image files.
 */
export const getImagesFromFileInput = async (files) => {
  try {
    // Load image data for each file
    const imageDataArray = await Promise.all(files.map(loadImageData));
    // Filter out invalid images
    const validImages = await filterInvalidImages(imageDataArray);
    // Resize and convert valid images
    const convertedImages = await Promise.all(
      validImages.map(resizeAndConvertImage)
    );
    // Download zip archive
    downloadZipArchive(convertedImages);
    return convertedImages;
  } catch (error) {
    console.error("Error handling image files:", error);
    throw new Error("Error handling image files: " + error.message);
  }
};

/**
 * Function to get image from URL input, resize and convert it, and download as a zip archive.
 * @param {string} url - URL of the image.
 * @returns {Promise<File>} - Converted image file.
 */
export const getImageFromUrlInput = async (url) => {
  try {
    // Load image data from URL
    const imageData = await loadUrlImageData(url);
    // Resize and convert image
    const convertedImage = await resizeAndConvertImage(imageData);
    // Download zip archive
    downloadZipArchive([convertedImage]);
    return convertedImage;
  } catch (error) {
    console.error("Error handling image URL:", error);
    throw new Error("Error handling image URL: " + error.message);
  }
};
