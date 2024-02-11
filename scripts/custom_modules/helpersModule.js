import { validateImage } from "./validationModule.js";
export const alertInvalidData = (data) => {
  const invalidDataNames = data
    .map((data) => (data ? data.name : "Unknown"))
    .join(", ");
  alert(
    `Some images are invalid: ${invalidDataNames}. Please make sure all images are valid and try again.`
  );
};
export const createInvalidObject = (file) => {
  return { valid: false, name: file.name };
};
export const createImageObj = (file, img, data) => {
  const validationResult = validateImage(file.name);
  const name = validationResult.isValid
    ? file.name.substring(0, file.name.lastIndexOf("."))
    : null;
  return {
    isValid: validationResult.isValid,
    name: name,
    dimensions: { width: img.width, height: img.height },
    size: file.size,
    src: URL.createObjectURL(file),
    extension: file.name.split(".").pop(),
    type: validationResult.type,
    data: data,
  };
};

export const calculateAspectRatio = ({ width, height }) =>
  (100 * height) / width;
export const calculateHeight = (width, aspectRatio) =>
  (width * aspectRatio) / 100;
