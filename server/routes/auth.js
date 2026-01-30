const express = require('express');
const authRouter = express.Router();
const { authLimiter } = require('../middlewares/rateLimiter');
const { userModel } = require('../schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { JWT_KEY } = require('../middlewares/userAuth');

// Zod validation schemas
const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

authRouter.post('/signup', authLimiter, async function (req, res) {
    try {
        // Validate input using Zod
        const validatedData = signupSchema.parse(req.body);
        const { name, email, password } = validatedData;

        // Check if email already exists
        const existAlready = await userModel.findOne({ email });
        if (existAlready) {
            return res.status(409).json({
                error: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 5);

        // Create user
        await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "Signed up successfully"
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
});

authRouter.post('/signin', authLimiter, async function (req, res) {
    try {
        // Validate input using Zod
        const validatedData = signinSchema.parse(req.body);
        const { email, password } = validatedData;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: "User not found. Please signup first"
            });
        }

        // Match password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: "Incorrect password"
            });
        }

        // Create JWT token
        const token = jwt.sign({
            id: user._id.toString(),
        }, JWT_KEY);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
});

module.exports = {
    authRouter
};
