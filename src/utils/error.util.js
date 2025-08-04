export const errorUtil = (error,req,res,next) => {
  console.log(error)
  res.status(error.status || 500).json({message : error.message || "Something Wrong"})
}