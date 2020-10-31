const express = require("express")

const router = express.Router()


//controllers
const userController = require("../controllers/user")

//middlewares
const isAuth = require("../middleware/isAuth")


router.get("/user", isAuth, userController.getUser)

router.get("/newStatus", isAuth, userController.modifyStatus)

router.get("/info", isAuth, userController.getUserId)

module.exports = router;