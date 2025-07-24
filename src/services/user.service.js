import prisma from "../config/prisma"

export const getAllDeal = async() => {
  const result = await prisma.deal.findMany({
    include :{
      
    }
  })
  return result
}