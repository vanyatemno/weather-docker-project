import { TransformFnParams } from "class-transformer/types/interfaces";

export const toArray = ({ value }: TransformFnParams) => {
  return Array.isArray(value) ? value : [value];
};
