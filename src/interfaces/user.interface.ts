/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

export type TOrder = {
  productName: string
  price: number
  quantity: number
}

export interface TUser {
  userId: number
  username: string
  password: string
  fullName: {
    firstName: string
    lastName: string
  }
  age: number
  email: string
  isActive: boolean
  hobbies: string[]
  address: {
    street: string
    city: string
    country: string
  }
  orders?: TOrder[]
}
export interface UserModel extends Model<TUser> {
  isUserExists(userId: number): Promise<TUser | null>
}

// export interface UserModel extends Model<TUser> {
//   isUserExists(userId: number): Promise<TUser | null>
// }
