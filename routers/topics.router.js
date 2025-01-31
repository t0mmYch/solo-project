const topicsRouter = require("express").Router()
const { getTopics } = require("../controller")

topicsRouter.get("/", getTopics)

module.exports = topicsRouter