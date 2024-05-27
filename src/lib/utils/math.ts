const randomInteger = (minimum: number, maximum: number) => {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

export const mathUtils = {
  randomInteger,
  clamp,
};
