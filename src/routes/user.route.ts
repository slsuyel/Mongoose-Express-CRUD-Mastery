import express from 'express'
import { userController } from '../controllers/user.controller'

const router = express.Router()

router.post('/', userController.createUser)
router.get('/', userController.getAllUsers)
router.get('/:userId', userController.getSingleUser)
router.put('/:userId', userController.updateUser)
router.delete('/:userId', userController.deleteUser)

/*  /api/users/:userId/orders */

router.put('/:userId/orders', userController.createNewOrder)
router.get('/:userId/orders', userController.getUserOrders)
router.get('/:userId/orders/total-price', userController.calculateTotal)

export const userRoutes = router
