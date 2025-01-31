//to do
const apiRouter = require("express").Router()
const articlesRouter = require("./articles.router")
const commentsRouter = require("./comments.router")
const topicsRouter = require("./topics.router")
const usersRouter = require("./users.router")
const { getEndPoints } = require("../controller")

apiRouter.get("/", getEndPoints)

apiRouter.use("/articles", articlesRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/topics", topicsRouter)
apiRouter.use("/users", usersRouter)

module.exports = apiRouter