// validationModule.js
import { getAllowedTypes } from "./settingsModule.js";
import { alertInvalidData } from "./helpersModule.js";

export const validateImageExtension = (fileName) => {
  const allowedTypes = getAllowedTypes();
  const extension = fileName.split(".").pop();
  const isValidName = fileName.split(".").length === 2;
  const isValidType = allowedTypes.includes(extension);
  return isValidName && isValidType;
};

const validateImageName = (fileName) => {
  const isBackground = /background|back/i.test(fileName);
  const isLeftOrRight = /left|right/i.test(fileName);
  return { isBackground, isLeftOrRight };
};

export const validateImage = (fileName) => {
  const isValid = validateImageExtension(fileName);
  const { isBackground, isLeftOrRight } = validateImageName(fileName);
  return {
    isValid: isValid && (isBackground || isLeftOrRight),
    type: isBackground ? "background" : isLeftOrRight ? "left-right" : null,
  };
};

export const filterInvalidImages = (images) => {
  const validImages = images.filter((imageData) => imageData.isValid);
  const invalidImages = images.filter((imageData) => !imageData.isValid);
  alertInvalidData(invalidImages);
  if (validImages.length == 0) {
    location.reload();
    return null;
  }
  return validImages;
};
