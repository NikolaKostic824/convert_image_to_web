import {
  calculateAspectRatio,
  calculateHeight,
  createInvalidObject,
  createImageObj,
} from "./helpersModule.js";
import { validateImage } from "./validationModule.js";

const setImageDimensions = (imageData) => {
  let width, height;
  const aspectRatio = calculateAspectRatio(imageData.dimensions);
  imageData.type == "left-right" ? (width = 1200) : (width = 1382);
  height = calculateHeight(width, aspectRatio);
  return { width, height };
};

export const loadImageData = (file) => {
  return new Promise((resolve, reject) => {
    const nameValidationResult = validateImage(file.name);
    if (!nameValidationResult.isValid) {
      console.error("Invalid image file:", file.name);
      resolve(createInvalidObject(file));
      return;
    }
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageData = readerEvent.target.result;
      // Create an Image object to get the width and height
      const img = new Image();
      img.onload = () => {
        const imageObj = createImageObj(file, img, imageData);
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

    reader.readAsDataURL(file);
  });
};

export const resizeAndConvertImage = async (imageData) => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = setImageDimensions(imageData);

    canvas.width = width;
    canvas.height = height;

    const blobPromise = new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/webp");
    });

    const image = new Image();
    image.onload = async () => {
      ctx.drawImage(image, 0, 0, width, height);
      const blob = await blobPromise;

      const newImageData = new File(
        [blob],
        imageData.name.split(".")[0] + ".webp",
        {
          type: "image/webp",
          lastModified: Date.now(),
        }
      );

      return newImageData;
    };
    image.onerror = (error) => {
      throw new Error("Error loading image: " + error.message);
    };

    const reader = new FileReader();
    reader.onload = () => {
      image.src = reader.result;
    };
    reader.onerror = (error) => {
      throw new Error("Error reading image: " + error.message);
    };
    reader.readAsDataURL(imageData);
  } catch (error) {
    throw new Error("Error resizing and converting image: " + error.message);
  }
};
