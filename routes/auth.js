const express = require('express');
const Router = express.Router();
const authRouter = Router();
const { userModel } = require('../schema');

authRouter.post('/signup', async function (req, res) {
    const { name, email, password } = req.body;
    //do validation of the input using zod

    //do hashing of password
    const hashedPassword = await bcrypt.hash(password, 5);

    //email already exists
    const existAlready = await userModel.findOne({ email });
    if (existAlready) {
        return res.status(409).json({
            error: "Email already exists"
        });
    }

    await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: "Signed up"
    })
})

authRouter.post('/signin', async function (req, res) {
    const { email, password } = req.body;

    //checking if user signup is done 
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({
            error: "signup first then login"
        });
    }

    //match password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({
            error: "password is incorrect"
        });
    }

    //jwt token
    const token = jwt.sign({
        id: user._id.toString(),
    }, JWT_KEY);

    res.status(200).json({
        success: true,
        message: "Successfull login",
        token: token
    })
})

module.exports = {
    authRouter
}