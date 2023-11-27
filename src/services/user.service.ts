import { TUser, TOrder } from '../interfaces/user.interface'

import User from '../models/user.model'

const createUser = async (userData: TUser): Promise<TUser> => {
  const result = await User.create(userData)
  return result
}

const getAllUsers = async (): Promise<TUser[]> => {
  const result = await User.aggregate([
    {
      $project: {
        username: 1,
        fullName: 1,
        age: 1,
        email: 1,
        address: 1,
      },
    },
  ])
  return result
}

const getSingleUser = async (userId: number): Promise<TUser | null> => {
  const result = await User.findOne({ userId: userId })
  return result
}

const updateUser = async (
  userId: number,
  userData: TUser,
): Promise<TUser | null> => {
  const result = await User.findOneAndUpdate({ userId: userId }, userData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteUser = async (id: number): Promise<TUser | null> => {
  const result = await User.findOneAndDelete({ userId: id })
  return result
}

const createNewOrderToDB = async (userId: number, order: TOrder) => {
  const newOrder = await User.updateOne(
    { userId },
    {
      $push: {
        orders: order,
      },
    },
  )
  return newOrder
}

const getUserOrdersFormDB = async (userId: number) => {
  const result = await User.findOne({ userId }, 'orders -_id')
  return result
}

const calculateTotalPrice = async (userId: number) => {
  if (await User.isUserExists(userId)) {
    const result = await User.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $unwind: '$orders',
      },
      {
        $group: {
          _id: '$userId',
          totalPrice: {
            $sum: {
              $multiply: ['$orders.price', '$orders.quantity'],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalPrice: {
            $round: ['$totalPrice', 2],
          },
        },
      },
    ])
    return result[0]
  } else {
    throw {
      error: {
        code: 404,
        description: 'User nor found!',
      },
    }
  }
}

export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createNewOrderToDB,
  getUserOrdersFormDB,
  calculateTotalPrice,
}
