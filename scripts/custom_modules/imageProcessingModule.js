import { filterInvalidImages } from "./validationModule.js";

import { loadImageData } from "./imageEngineModule.js";
export const getImagesFromFileInput = async (files) => {
  try {
    const imageDataArray = await Promise.all(files.map(loadImageData));
    const validImages = await filterInvalidImages(imageDataArray);
    return validImages;
  } catch (error) {
    console.error("Error handling image files:", error);
    throw new Error("Error handling image files: " + error.message);
  }
};
