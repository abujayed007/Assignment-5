import { TGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  // Check if matchedArray exists and has at least 2 elements (full match + group 1)
  const extractedValue =
    matchedArray && matchedArray.length >= 2
      ? matchedArray[1]
      : "Unknown field";

  return {
    statusCode: 400,
    message: `${extractedValue} already exists!!`,
  };
};
