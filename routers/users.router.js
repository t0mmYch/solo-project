const usersRouter = require("express").Router()
const { getUsersF } = require("../controller")

usersRouter.get("/", getUsersF)

module.exports = usersRouter