import { Rating } from "@/app/models/Rating";

const isKeyOfRatings = (key: number): key is keyof Rating['ratings'] => {
  return [1,2,3,4,5].includes(key);
}

export { isKeyOfRatings };