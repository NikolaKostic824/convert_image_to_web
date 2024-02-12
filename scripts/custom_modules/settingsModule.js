// Array containing allowed image file types
const allowedTypes = ["jpg", "jpeg", "png", "gif"];

// Object to store URL image data
const urlData = {
  imageType: "background",
};

/**
 * Function to add a new allowed image file type.
 * @param {string} type - New image file type to add.
 */
export const setAllowedTypes = (type) => allowedTypes.push(type);

/**
 * Function to get the array of allowed image file types.
 * @returns {string[]} - Array of allowed image file types.
 */
export const getAllowedTypes = () => allowedTypes;

/**
 * Function to set the image type for URL images.
 * @param {string} data - Image type for URL images.
 */
export const setUrlImageType = (data) => (urlData.imageType = data);

/**
 * Function to get the image type for URL images.
 * @returns {string} - Image type for URL images.
 */
export const getUrlImageType = () => urlData.imageType;
