import express from 'express'
import { UserModel } from '../models/UserModel.js'
import * as auth from '../controllers/AuthController.js'
import * as user from '../controllers/UserController.js'

const router = express.Router()

router.post('/new', auth.Register)
router.post('/login', auth.Login)
router.post('/logout', auth.Logout)

router.put('/:id', user.Update)

/**
 * This route will display all users.
**/
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find({})
    return res.status(200).json({
      count: users.length,
      data: users
    })
  } catch (error) {
    console.log('Error fetching users:', error.message)
    res.status(500).json({message: error.message})
  }
})

/**
 * This route will display 1 user by username.
**/
router.get('/:username', async (req, res) => {
  try{
    const user = await UserModel.find({username: req.params.username})
    return res.status(200).json(user)
  }catch(error){
    console.log(error.message)
    res.status(500).json({message: error.message})
  }
})

/**
 * This route will display 1 user by ID.
**/
router.get('/:id', async (req, res) => {
  try{
    const user = await UserModel.findById(req.params.id)
    return res.status(200).json(user)
  }catch(error){
    console.log(error.message)
    res.status(500).json({message: error.message})
  }
})

export default router