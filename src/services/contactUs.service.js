import prisma from "../config/prisma.js"

export const contactUs = async(data) => {
const {name , email, tel_number,message} = data
const result = await prisma.contactMessage.create({
  data : {
    name,
    email,
    tel_number,
    message,
  }
})
return result
}