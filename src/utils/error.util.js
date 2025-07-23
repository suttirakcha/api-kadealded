export const errorUtil = (error,req,res,next) => {
  console.log(error.message)
  res.status(error.code || 500).json({message : error.message || "Something Wrong"})
}