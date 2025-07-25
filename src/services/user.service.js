import prisma from "../config/prisma.js"

export const getAllDeal = async() => {
  const result = await prisma.deal.findMany({
    include :{
      
    }
  })
  return result
}