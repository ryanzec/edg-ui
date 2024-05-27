const toTitleCase = (value: string) => {
  return value.replace(/\w\S*/g, (valueToModify: string) => {
    return valueToModify.charAt(0).toUpperCase() + valueToModify.substr(1).toLowerCase();
  });
};

const splitOnceWithAll = <TValue1 = string, TValue2 = string>(value: string, separator: string): [TValue1, TValue2] => {
  const parts = value.split(separator);

  return [(parts.shift() || '') as TValue1, parts.join(separator) as TValue2];
};

export const stringUtils = {
  toTitleCase,
  splitOnceWithAll,
};
