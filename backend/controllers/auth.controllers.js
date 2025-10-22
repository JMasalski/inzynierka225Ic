import prisma from "../lib/prismaClient.js";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}


export const createUser = async (req, res) => {
    try {
        const {students} = req.body;
        if (!students || !Array.isArray(students) || students.length === 0) {
            return res.status(400).json({message: "Lista uczniów jest wymagana"})
        }
        const user = req.user
        if (user.role !== "ROOT" && user.role !== "TEACHER") {
            res.status(403).json({message: "Brak uprawnień do dodawania użytkowników"})
        }

        const hashedPassword = await bcrypt.hash(process.env.FIRST_PASSWORD, 10);

        const newUsersData = students.map((student) => {
            if (!student.username || !student.role) {
                throw new Error("Każdy użytkownik musi mieć username i role");
            }

            return {
                username: student.username,
                password: hashedPassword,
                role: student.role,
                createdByTeacherId: user.id,
            };
        });

        const newUsers = await prisma.user.createMany({
            data: newUsersData,
            skipDuplicates: true,
        });

        return res.status(201).json({
            message: "Użytkownicy zostali dodani pomyślnie",
            count: newUsers.count,
        });
    } catch
        (err) {
        console.log(err)

    }
}
export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        if (!username || !password) {
            return res.status(401).json({error: "Nazwa użytkownika lub hasło jest wymagane"});
        }

        const existingUser = await prisma.user.findUnique({where: {username}});
        if (!existingUser) {
            return res.status(401).json({error: "Nie znaleziono użytkownika"});
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordMatch) {
            return res.status(401).json({error: "Nieprawidłowe dane"})
        }


        const token = signToken(existingUser.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        return res.status(200).json({
            message: "Zalogowano pomyślnie", user: {
                id: existingUser.id,
                username: existingUser.username,
                role: existingUser.role,
            },
        });
    } catch (err) {

    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json({success: true, message: "Wylogowano"})
}

export const authUser = async (req, res) => {
    res.send({
        success: "true", user:
        req.user
    })
}