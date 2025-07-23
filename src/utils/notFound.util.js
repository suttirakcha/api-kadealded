export const notFoundUtil = (req , res ) => {
  res.status(404).json({message : "404 Not Found"})
}