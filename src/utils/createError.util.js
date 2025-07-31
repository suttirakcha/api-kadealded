export const createErrorUtil = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};
