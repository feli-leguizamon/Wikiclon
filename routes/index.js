const express = require("express")
const router = express.Router()
const userRouter = require("./user")
const wikiRouter = require("./wiki")

router.use("/users", userRouter)
router.use("/wiki", wikiRouter)
router.use("/", wikiRouter)

module.exports = router