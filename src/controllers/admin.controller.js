import prisma from "../config/prisma.js"
import * as adminService from "../services/admin.service.js"
import { createErrorUtil } from "../utils/createError.util.js";

export const createDeal = async (req, res, next) => {
  try {
    const data = req.body

    // Check whether the user role is admin or not, will paste with other controllers
    // Put the ? after 'user' to avoid the error
    // user.role = will throw the error if user is not found
    // user?.role = will return null if user is not found
    const { id } = req.user;
    const user = await prisma.user.findUnique({ 
      where: { id }
    })

    if (user?.role !== "ADMIN"){
      createErrorUtil(403, "Only admins can create the deal");
    }

    const result = await adminService.createDeal(data)
    res.status(201).json({message: "Deal Created", result})
  } catch (error) {
    next(error)
  }
}
export const updateDeal = async (req, res, next) => {
  try {
    const {id} = req.params
    const data = req.body
    const result = await adminService.updateDeal(id,data)
    res.status(200).json({message: "Deal Updated", result})
  } catch (error) {
    next(error)
  }
}
export const deleteDeal = async (req, res, next) => {
  try {
    const {id} = req.params
    const result = await adminService.deleteDeal(id)
    res.status(200).json({message: "Deal Deleted", result})
  } catch (error) {
    next(error)
  }
}
export const getAllDealJoiner = async (req, res, next) => {
  try {
    const {id} = req.params
    const result = await adminService.getAllDealJoiner(id)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
export const getAllConfirmations = async (req, res, next) => {
  try {
    const result = await adminService.getAllConfirmations()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
export const approveRefundRequest = async (req, res, next) => {
  try {
    const {joinId} = req.params
    const result = await adminService.approveRefundRequest(joinId)
    res.status(200).json({message: "Refund Approved", result})
  } catch (error) {
    next(error)
  }
}
export const rejectRefundRequest = async (req, res, next) => {
  try {
    const {joinId} = req.params
    const result = await adminService.rejectRefundRequest(joinId)
    res.status(200).json({message: "Refund Rejected", result})
  } catch (error) {
    next(error)
  }
}
export const getAllStatistics = async (req, res, next) => {
  try {
    const result = await adminService.getAllStatistics()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}