import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: passwordHash,
            username
        });

        const savedUser = await newUser.save();
        const token = await createAccessToken({ id: savedUser._id });
        res.cookie('token', token);
        res.json({
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username
        });


    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario");
    }

    console.log(email, password, username);
};

export const login = async (req, res) => {
    const { password, username } = req.body;

    try {

        const userFound = await User.findOne({ username });

        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch) return res.status(400).json({ message: "Credenciales incorrectas" });

        const token = await createAccessToken({ id: userFound._id });
        res.cookie('token', token);
        res.json({
            id: userFound._id,
            email: userFound.email,
            username: userFound.username
        });


    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario");
    }

    console.log( password, username);
};

export const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.sendStatus(200);

};

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
            id: userFound._id,
            email: userFound.email,
            username: userFound.username
        });;
};
