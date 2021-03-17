import { ValidationError } from 'yup';

interface ErrorData {
  [key: string]: string;
}

export function getValidationErrors(exceptions: ValidationError): ErrorData {
  const errors: ErrorData = {};

  exceptions.inner.forEach((ex) => {
    errors[ex.path] = ex.message;
  });

  return errors;
}
