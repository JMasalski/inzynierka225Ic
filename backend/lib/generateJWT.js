import jwt from "jsonwebtoken";

export const signToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("Brak JWT_SECRET w pliku konfiguracyjnym");
    }
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}
