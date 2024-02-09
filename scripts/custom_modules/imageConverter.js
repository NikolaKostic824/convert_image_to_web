import { calculateAspectRatio, calculateHeight } from "./helpersModule.js";

const setImageDimensions = (imageData) => {
  let width, height;
  const aspectRatio = calculateAspectRatio(imageData.dimensions);
  if (imageData.type == "left-right") {
    width = 1200;
  }
  if (imageData.type == "background" || imageData.type == "back") {
    width = 1382;
  }
  height = calculateHeight(width, aspectRatio);
  return { width, height };
};
export const resizeImageToWebP = async (imageData) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = setImageDimensions(imageData);

    const image = new Image(); // Kreiraj novi objekat slike
    image.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const newImageData = new File(
          [blob],
          imageData.name.split(".")[0] + ".webp",
          {
            type: "image/webp",
            lastModified: Date.now(),
          }
        );
        resolve(newImageData);
      }, "image/webp");
    };
    image.onerror = (error) => {
      reject(error);
    };
    image.src = URL.createObjectURL(imageData); // Postavi URL slike na novi objekat slike
  });
};

// export const resizeImageToWebP = async (imageData) => {
//   return new Promise((resolve, reject) => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     imageData.dimensions = setImageDimensions(imageData);
//     // const image = new Image();
//     imageData.onload = () => {
//       canvas.width = imageData.dimensions.width;
//       canvas.height = imageData.dimensions.height;

//       // Nacrtaj sliku na kanvas
//       ctx.drawImage(
//         imageData,
//         0,
//         0,
//         imageData.dimensions.width,
//         imageData.dimensions.height
//       );

//       // Konvertuj sliku u format WebP
//       canvas.toBlob((blob) => {
//         const newImageData = new File(
//           [blob],
//           imageData.name.split(".")[0] + ".webp",
//           {
//             type: "image/webp",
//             lastModified: Date.now(),
//           }
//         );
//         resolve(newImageData);
//       }, "image/webp");
//     };
//     imageData.onerror = (error) => {
//       reject(error);
//     };
//     //image.src = URL.createObjectURL(imageData);
//   });
// };
