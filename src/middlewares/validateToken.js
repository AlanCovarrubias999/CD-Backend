import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) return res.status(401).json({message: 'Sin autorización, token no proporcionado'});
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({message: 'Token inválido'});

        req.user = user;
        next();
    });
    console.log("Token from cookies:", token);
}