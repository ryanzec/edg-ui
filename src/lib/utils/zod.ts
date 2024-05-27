import type { ZodError, ZodType } from 'zod';

// disabling eslint as there is some weird prettier / eslint interaction with this code that cause this to end
// in a failed state after formatting
/* eslint-disable */
// this is the recommended way for checking a zod schema in sync with referencing type
// reference: https://github.com/colinhacks/zod/issues/372#issuecomment-826380330
const schemaForType =
  <T>() =>
  <S extends ZodType<T, any, any>>(arg: S) => {
    return arg;
  };
/* eslint-enable */

const getErrorPaths = <TSchemaData>(zodError: ZodError) => {
  const keys: TSchemaData[] = [];

  zodError.issues.forEach((issue) => {
    keys.push(issue.path.join('.') as TSchemaData);
  });

  return [...new Set(keys)];
};

// because this method is using is use a string as a path to get a zod type from any zod shape, not sure how to
// do that other than using any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedSchema = (path: string, shape: any): ZodType => {
  const pathParts = path.split('.');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentSchema: any = shape;

  for (let i = 0; i < pathParts.length; i++) {
    const currentPathPart = pathParts[i];
    const nextPath = pathParts[i + 1];

    // last one
    if (i === pathParts.length - 1) {
      currentSchema = currentSchema[currentPathPart];

      break;
    }

    // if it is not a number, than that means this is an object type and we just need `.shape`
    if (!nextPath || isNaN(parseInt(nextPath))) {
      currentSchema = currentSchema[currentPathPart].shape;

      continue;
    }

    // the first cover array of objects where the second cover arrays of simple data
    currentSchema = currentSchema[currentPathPart].element.shape || currentSchema[currentPathPart].element;

    // we bump up the next path part since we have already dealt with the array portion
    i++;
  }

  return currentSchema as ZodType;
};

export const zodUtils = {
  schemaForType,
  getErrorPaths,
  getNestedSchema,
};
