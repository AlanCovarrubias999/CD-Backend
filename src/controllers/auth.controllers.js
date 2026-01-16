import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv/config.js';

export const register = async (req, res) => {
    const {email, password, username} = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            email, 
            password: passwordHash,
            username
        });

        const savedUser = await newUser.save();

        jwt.sign(
            {id: savedUser._id}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1d'},
            (err, token) => {
                if (err) console.log(err);
                res.json({token});
            });

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario");
    }

    console.log(email, password, username);
}
export const login = (req, res) => {
    
}
