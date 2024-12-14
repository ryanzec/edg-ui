import * as _ from 'lodash-es';

// we need to allow any here as this is used to deeping get all keys for an object that can have any values

const collectKeysForValue = (value: any, keys: string[] = [], parent: string = '') => {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      collectKeysForValue(value[i], keys, `${parent}.${i}`);
    }

    // we need to make sure we get the key for the base array property
    keys.push(parent);

    return;
  }

  if (_.isObject(value)) {
    Object.keys(value).forEach((key) => {
      // we need to allow any here as this is used to deeping get all keys for an object that can have any values

      const currentValue = (value as Record<string, any>)[key];

      collectKeysForValue(currentValue, keys, parent ? `${parent}.${key}` : key);
    });

    return;
  }

  if (!parent) {
    return;
  }

  keys.push(parent);
};

export const objectUtils = { collectKeysForValue };
