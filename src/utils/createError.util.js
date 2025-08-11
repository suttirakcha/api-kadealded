export const createErrorUtil = (status = 400, message) => {
  const error = new Error(message);
  error.statusCode = status;
  throw error;
};
