const Express = require("express");
const router = Express.Router()
const { UserModel } = require("../models");
const User = require("../models/user");

const { UniqueConstraintError } = require("sequelize/lib/errors");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



router.post("/register", async (req, res) => {

    let { email, password } = req.body;
    try {
        const User = await UserModel.create({
            email,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: `Failed to register user` + err,
            });
        }
    }
});
router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {
            let passwordComparsion = await bcrypt.compare(password, loginUser.password)
            if (passwordComparsion) {
                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
            }
            res.status(200).json({
                user: loginUser,
                message: "User logged in.",
                sessionToken: token
            });
        } else {
            res.status(401).json({
                message: "Login failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed login"
        })
    }
});


module.exports = router;
