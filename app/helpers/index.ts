//@ts-nocheck
import imglyRemoveBackground from "@imgly/background-removal";

//NOTE - gets the initials of full name. name should be a string
export default function getInitials(name: string) {
  if (name === undefined || null) {
    return;
  }
  // Split the name into an array of words
  const words = name.split(" ");

  // Get the first letter of each word and capitalize it
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  // Join the initials into a single string
  return initials.join("");
}

// export async function removeImageBackground(url: string) {
//   try {
//     const blob = await imglyRemoveBackground(url);
//     const newImage = URL.createObjectURL(blob);

//     console.log(newImage);
    
//     return newImage;
//   } catch (error) {
//     console.error("Error removing background:", error);
//   }
// }
