const {getSingleUser,getAllUsers} = require("../controllers/user");
const {checkUserExist} = require("../middlewares/database/databaseErrorHelpers");
const User = require("../models/user");

const userQueryMiddleware = require("../middlewares/query/userQueryMiddleware");

const express = require("express");

const router = express.Router();


router.get("/",userQueryMiddleware(User),getAllUsers);

router.get("/:id",checkUserExist,getSingleUser);

module.exports = router;
