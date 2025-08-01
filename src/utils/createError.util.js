export const createErrorUtil = (status = 400, message) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};
