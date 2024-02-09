import { validateImage, filterInvalidImages } from "./validationModule.js";
import { createInvalidObject, createImageObj } from "./helpersModule.js";
import { resizeImageToWebP } from "./imageConverter.js";

const getImageData = (file) => {
  return new Promise((resolve) => {
    const nameValidationResult = validateImage(file.name);

    if (!nameValidationResult.isValid) {
      console.error("Invalid image file:", file.name);
      resolve(createInvalidObject(file));
      return;
    }
    const img = new Image();
    img.onload = () => {
      const imageObj = createImageObj(file);
      imageObj.dimensions.width = img.width;
      imageObj.dimensions.height = img.height;
      resolve(imageObj);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
      resolve(null);
    };
    img.src = URL.createObjectURL(file);
  });
};

export const getImagesFromFileInput = async (files) => {
  try {
    const promises = files.map(async (file) => {
      return await getImageData(file);
    });
    const imageDataArray = await Promise.all(promises);
    const validImages = await filterInvalidImages(imageDataArray);
    console.log("VI", validImages);
    await Promise.all(
      validImages.map(async (image) => {
        return await resizeImageToWebP(image);
      })
    );
    return resizedImages;
  } catch (error) {
    throw new Error("Error handling image files: " + error.message);
  }
};
