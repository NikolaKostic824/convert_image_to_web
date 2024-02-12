/**
 * Function to create a ZIP archive containing converted images.
 * @param {Object[]} convertedImages - Array of converted image data objects.
 * @returns {Blob} - Blob containing the ZIP archive content.
 */
const createZipArchive = async (convertedImages) => {
  try {
    // Create a new instance of JSZip
    const zip = new JSZip();
    // Add each converted image to the ZIP archive
    convertedImages.forEach((image) => zip.file(`${image.name}`, image));

    // Generate the ZIP archive content asynchronously
    const content = await zip.generateAsync({ type: "blob" });
    return content;
  } catch (error) {
    throw new Error("Error creating ZIP archive: " + error.message);
  }
};

/**
 * Function to download a ZIP archive containing converted images.
 * @param {Object[]} convertedImages - Array of converted image data objects.
 */
export const downloadZipArchive = async (convertedImages) => {
  try {
    // Create the ZIP archive content
    const zipContent = await createZipArchive(convertedImages);

    // Create a Blob from the ZIP content
    const blob = new Blob([zipContent], { type: "application/zip" });
    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);
    // Create a link element to trigger the download
    const link = document.createElement("a");
    // Set the href attribute to the URL
    link.href = url;
    // Set the download attribute with the desired file name
    link.download = "converted_images.zip";
    // Append the link to the document body
    document.body.appendChild(link);
    // Programmatically trigger the click event on the link
    link.click();
    // Remove the link from the document body
    document.body.removeChild(link);
    // Revoke the URL to release memory
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Error downloading ZIP archive: " + error.message);
  }
};
