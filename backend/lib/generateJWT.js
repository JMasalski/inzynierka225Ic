import jwt from "jsonwebtoken";

export const signToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment configuration");
    }
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}
