"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handlerDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    // Check if matchedArray exists and has at least 2 elements (full match + group 1)
    const extractedValue = matchedArray && matchedArray.length >= 2
        ? matchedArray[1]
        : "Unknown field";
    return {
        statusCode: 400,
        message: `${extractedValue} already exists!!`,
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
