import {
  getImagesFromFileInput,
  getImageFromUrlInput,
} from "./custom_modules/imageProcessingModule.js";
import {
  setAllowedTypes,
  setUrlImageType,
} from "./custom_modules/settingsModule.js";
import { validateImageUrl } from "./custom_modules/validationModule.js";

/**
 * Function to initialize the main elements and set up event listeners.
 */
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
  };
  let radio = {
    radioContainer: null,
    backgroundRadio: null,
    leftRightRadio: null,
  };

  /**
   * Initialize HTML elements.
   */
  const initializeElements = () => {
    inputs.fileInput = document.getElementById("imageInput");
    inputs.urlInput = document.getElementById("imageUrlInput");
    buttons.convertButton = document.getElementById("convertButton");
    containers.defaultContainer = document.getElementById("defaultContainer");
    radio.radioContainer = document.getElementById("radioContainer");
    radio.backgroundRadio = document.getElementById("backgroundRadio");
    radio.leftRightRadio = document.getElementById("leftRightRadio");
  };

  /**
   * Set up event listeners.
   */
  const setupEventListeners = () => {
    inputs.fileInput.addEventListener("change", async () => {
      try {
        buttons.convertButton.setAttribute("disabled", "disabled");
        await getImagesFromFileInput(Array.from(inputs.fileInput.files));
        // Clear file input after processing
        inputs.fileInput.value = "";
      } catch (error) {
        console.error("Error handling Images file input change:", error);
      }
    });

    inputs.urlInput.addEventListener("input", () => {
      const imageUrl = inputs.urlInput.value.trim();
      if (validateImageUrl(imageUrl)) {
        buttons.convertButton.removeAttribute("disabled");
        radio.radioContainer.style.display = "block";
      } else {
        buttons.convertButton.setAttribute("disabled", "disabled");
        radio.radioContainer.style.display = "none";
      }
    });

    buttons.convertButton.addEventListener("click", async () => {
      try {
        await getImageFromUrlInput(inputs.urlInput.value);
        // Clear url input after processing
        inputs.urlInput.value = "";
        buttons.convertButton.setAttribute("disabled", "disabled");
        radio.radioContainer.style.display = "none";
      } catch (error) {
        console.error("Error handling image conversion:", error);
      }
    });

    radio.backgroundRadio.addEventListener("change", () =>
      radio.backgroundRadio.checked ? setUrlImageType("background") : null
    );

    radio.leftRightRadio.addEventListener("change", () =>
      radio.leftRightRadio.checked ? setUrlImageType("left-right") : null
    );
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
