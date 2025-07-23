export const errorMiddleware = (error,req,res,next) => {
  console.log(error.message)
  res.status(error.code || 500).json({message : message.code || "Something Wrong"})
}