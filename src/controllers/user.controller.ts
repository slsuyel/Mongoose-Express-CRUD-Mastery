/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { userServices } from '../services/user.service'
import User from '../models/user.model'
import { userValidationSchema } from '../validations/user.validation'
import { TUser } from '../interfaces/user.interface'

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const validatedUser = userValidationSchema.parse(userData)
    const result = await userServices.createUser(validatedUser as TUser)
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: result,
    })
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Something went wrong',
    })
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers()
    res.status(200).json({
      status: 'success',
      message: 'User fetched successfully',
      data: result,
    })
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Something went wrong',
    })
  }
}

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId)

    const user = await User.isUserExists(id)
    if (!user) {
      // User not found
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }
    res.status(200).json({
      status: 'success',
      message: 'Single User fetched successfully',
      data: user,
    })
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Something went wrong',
    })
  }
}

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)
    const userData = req.body

    const existingUser = await User.isUserExists(userId)
    if (!existingUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }
    const result = await userServices.updateUser(userId, userData)

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: result,
    })
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Something went wrong',
    })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)
    const existingUser = await User.isUserExists(userId)

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }
    await userServices.deleteUser(userId)
    res.status(200).json({
      success: true,
      message: 'User deleted successfully!',
      data: null,
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
    })
  }
}

const createNewOrder = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)
    const order = req.body
    const existingUser = await User.isUserExists(userId)
    if (existingUser) {
      const result = await userServices.createNewOrderToDB(
        Number(userId),
        order,
      )
      res.status(200).json({
        success: true,
        message: 'Order created successfully!',
        data: null,
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: null,
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    })
  }
}
const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId)
    const existingUser = await User.isUserExists(userId)

    if (existingUser) {
      const result = await userServices.getUserOrdersFormDB(Number(userId))
      res.status(200).json({
        success: true,
        message: 'All orders retrieved successfully',
        data: result,
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          description: 'User not found!',
        },
      })
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    })
  }
}

const calculateTotal = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const result = await userServices.calculateTotalPrice(Number(userId))
    res.status(200).json({
      success: true,
      message: 'Total price calculated successfully!',
      data: result,
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: 'User not found!',
      },
    })
  }
}

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createNewOrder,
  getUserOrders,
  calculateTotal,
}
