import { getImagesFromFileInput } from "./custom_modules/imagesModule.js";
import { setAllowedTypes } from "./custom_modules/settingsModule.js";

document.addEventListener("DOMContentLoaded", () => {
  // References on the main page
  let inputs = {
    fileInput: null,
    urlInput: null,
  };
  let buttons = {
    convertButton: null,
  };
  let containers = {
    defaultContainer: null,
    loadingContainer: null,
  };
  // Initialize HTML element
  const initializeElements = () => {
    inputs.fileInput = document.getElementById("imageInput");
    inputs.urlInput = document.getElementById("imageUrlInput");
    buttons.convertButton = document.getElementById("convertButton");
    containers.defaultContainer = document.getElementById("defaultContainer");
    containers.loadingContainer = document.getElementById("loadingContainer");
  };

  const setupEventListeners = () => {
    inputs.fileInput.addEventListener("change", async () => {
      try {
        const images = await getImagesFromFileInput(
          Array.from(inputs.fileInput.files)
        );
        console.log(images);
      } catch (error) {
        console.error("Error handling Images file input change:", error);
      }
    });
  };

  // Main initializer
  const initialize = () => {
    initializeElements();
    setupEventListeners();
  };
  // Run main initializer
  initialize();
  setAllowedTypes("png");
});
