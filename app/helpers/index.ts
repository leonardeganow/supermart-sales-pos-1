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

const name = "leonard adjei";
const initials = getInitials(name);

console.log(initials); // Outputs: LA
