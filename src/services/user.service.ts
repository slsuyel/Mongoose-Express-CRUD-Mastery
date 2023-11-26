import { IUser } from '../interfaces/user.interface'

import User from '../models/user.model'

const createUser = async (userData: IUser): Promise<IUser> => {
  const result = await User.create(userData)

  return result
}
/*     const users = await User.find({}, 'username fullName age email address');
 */
const getAllUsers = async (): Promise<IUser[]> => {
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

const getSingleUser = async (userId: number): Promise<IUser | null> => {
  const result = await User.findOne({ userId: userId })
  return result
}

const updateUser = async (
  userId: number,
  userData: IUser,
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ userId: userId }, userData, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteUser = async (id: number): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ userId: id })
  return result
}

export const userServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
}
