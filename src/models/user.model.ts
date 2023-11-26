import { Document, Query, Schema, model } from 'mongoose'
import { IUser } from '../interfaces/user.interface'
import bcrypt from 'bcrypt'
import config from '../config'

const userSchema: Schema<IUser> = new Schema({
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
})

// Pre Hook for Query Middleware

userSchema.pre(/^find/, function (this: Query<IUser, Document>, next) {
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

const User = model<IUser>('User', userSchema)

export default User
