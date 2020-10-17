const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')

const { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, getUserById, updateUser, deleteUser } = require('../controller/userController')

router.route('/')
    .get(protect, admin, getUsers)
    .post(registerUser)

router.post('/login', authUser)

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser)

module.exports = router;