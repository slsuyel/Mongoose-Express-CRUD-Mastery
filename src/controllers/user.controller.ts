/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { userServices } from '../services/user.service'

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const result = await userServices.createUser(userData)
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
    // Use a static method to check if the user exists
    const user = await userServices.getSingleUser(id)

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
    const existingUser = await userServices.getSingleUser(userId)
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
    const existingUser = await userServices.getSingleUser(userId)

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

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
}
