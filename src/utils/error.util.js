export const errorUtil = (error,req,res,next) => {
  console.log(error.message)
  res.status(error.status || 500).json({message : error.message || "Something Wrong"})
}