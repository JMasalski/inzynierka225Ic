import jwt from 'jsonwebtoken';
import prisma from "../utils/prismaClient.js";


export const authenticate = async (req, res, next) => {
    try{
    const token = req.cookies.jwt;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, role: true , hasOnboarded:true,firstName:true, lastName:true},
    });

    req.user = user;
    next();

    }catch(err){
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
};