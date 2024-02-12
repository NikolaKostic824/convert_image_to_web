import {
  calculateAspectRatio,
  calculateHeight,
  createInvalidObject,
  createImageObj,
} from "./helpersModule.js";
import { validateImage } from "./validationModule.js";
import { getUrlImageType } from "./settingsModule.js";

// Maximum image size in bytes
const MAX_IMAGE_SIZE = 250 * 1024;
// Step for decreasing image quality
const IMAGE_QUALITY_STEP = 0.1;

/**
 * Function to set image dimensions based on image type.
 * @param {Object} imageData - Object containing image data.
 * @returns {Object} - Object with width and height properties.
 */
const setImageDimensions = (imageData) => {
  let width, height;
  // Calculate aspect ratio based on image dimensions
  const aspectRatio = calculateAspectRatio(imageData.dimensions);
  // Set width based on image type
  imageData.type == "left-right" ? (width = 1200) : (width = 1382);
  // Calculate height based on width and aspect ratio
  height = calculateHeight(width, aspectRatio);
  return { width, height };
};

/**
 * Function to convert image data to WebP format.
 * @param {Object} imageData - Object containing image data.
 * @param {number} imageQuality - Quality of the output image.
 * @returns {Promise<File>} - Converted image file.
 */
const convertToWebP = async (imageData, imageQuality) => {
  // Get image dimensions
  const { width, height } = setImageDimensions(imageData);
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Create an image element
  const img = new Image();
  img.src = imageData.src;
  // Wait for image to load
  await new Promise((resolve) => {
    img.onload = () => {
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      resolve();
    };
  });

  // Convert canvas content to WebP format
  const webpData = canvas.toDataURL("image/webp", imageQuality);

  // Fetch WebP data and create a new blob
  const blob = await fetch(webpData).then((res) => res.blob());
  // Create a new File object with the WebP blob
  const newImageFile = new File([blob], `${imageData.name}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return newImageFile;
};

/**
 * Function to fetch image from URL and convert it to a file.
 * @param {string} imageUrl - URL of the image.
 * @param {string} fileName - Name of the file.
 * @returns {Promise<File>} - Converted image file.
 */
const fetchImageAsFile = async (imageUrl, fileName) => {
  try {
    // Fetch image data
    const response = await fetch(imageUrl);
    // Get blob data from response
    const blob = await response.blob();
    // Create a File object from the blob
    const imageFile = new File([blob], fileName, {
      type: response.headers.get("content-type"),
    });
    return imageFile;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Error fetching image");
  }
};

/**
 * Function to resize and convert image data.
 * @param {Object} imageData - Object containing image data.
 * @returns {Promise<File>} - Converted image file.
 */
export const resizeAndConvertImage = async (imageData) => {
  try {
    // Initial image quality
    let imageQuality = 1.0;
    // Convert image to WebP format
    let imageFile = await convertToWebP(imageData, imageQuality);
    // Decrease image quality until it fits within the maximum size
    while (imageFile.size > MAX_IMAGE_SIZE && imageQuality > 0) {
      imageQuality -= IMAGE_QUALITY_STEP;
      imageFile = await convertToWebP(imageData, imageQuality);
    }
    return imageFile;
  } catch (error) {
    throw new Error("Error converting image to webp: " + error.message);
  }
};

/**
 * Function to load image data from a file.
 * @param {File} file - Image file.
 * @returns {Promise<Object>} - Object containing image data.
 */
export const loadImageData = (file) => {
  return new Promise((resolve, reject) => {
    // Validate image file
    const nameValidationResult = validateImage(file.name);
    if (!nameValidationResult.isValid) {
      // Reject promise if image is invalid
      console.error("Invalid image file:", file.name);
      resolve(createInvalidObject(file));
      return;
    }
    // Read file data as Data URL
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = readerEvent.target.result;
      // Create an Image object to get the width and height
      const img = new Image();
      img.onload = () => {
        // Create image object
        const imageObj = createImageObj(file, img);
        resolve(imageObj);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageData;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    // Start reading the file as Data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Function to load image data from a URL.
 * @param {string} imageUrl - URL of the image.
 * @returns {Promise<Object>} - Object containing image data.
 */
export const loadUrlImageData = async (imageUrl) => {
  try {
    // Fetch image file from URL
    const file = await fetchImageAsFile(imageUrl);
    // Create a FileReader object
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (readerEvent) => {
        const imageData = readerEvent.target.result;
        const img = new Image();

        img.onload = () => {
          // Create image object
          const imageObj = createImageObj(file, img);
          // Set image name and type
          imageObj.name = getUrlImageType();
          imageObj.type = getUrlImageType();
          resolve(imageObj);
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.src = imageData;
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Start reading the file as Data URL
      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error("Error loading image data: " + error.message);
  }
};
