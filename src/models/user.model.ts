import { Document, Query, Schema, model } from 'mongoose'
import { TUser } from '../interfaces/user.interface'
import bcrypt from 'bcrypt'
import config from '../config'
import { UserModel } from './../interfaces/user.interface'

const userSchema: Schema<TUser> = new Schema<TUser>({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    validate: {
      validator: Number.isInteger,
      message: 'UserId must be an integer',
    },
  },

  username: { type: String, required: [true, 'Username is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  fullName: {
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
  },
  age: { type: Number, required: [true, 'Age is required'], min: 0 },

  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    required: [true, 'isActive is required'],
    default: true,
  },
  hobbies: [
    { type: String, required: [true, 'At least one hobby is required'] },
  ],
  address: {
    street: { type: String, required: [true, 'Street is required'] },
    city: { type: String, required: [true, 'City is required'] },
    country: { type: String, required: [true, 'Country is required'] },
  },
  orders: {
    type: [
      {
        productName: {
          type: String,
          required: [true, 'Product name is required'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
        },
      },
    ],
    required: false,
  },
})

// Pre Hook for Query Middleware

userSchema.pre(/^find/, function (this: Query<TUser, Document>, next) {
  this.find({ isActive: { $eq: true } })
  next()
})

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

userSchema.set('toJSON', {
  transform: function (doc: Document, ret) {
    delete ret.password
    return ret
  },
})

userSchema.statics.isUserExists = async function (userId: number) {
  const user = await User.findOne({ userId })
  return user
}

const User = model<TUser, UserModel>('User', userSchema)

export default User
