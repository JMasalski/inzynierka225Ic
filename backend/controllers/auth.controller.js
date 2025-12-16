import prisma from "../lib/prismaClient.js";
import * as bcrypt from "bcryptjs";
import {ROLES} from "../lib/roles.js";
import {signToken} from "../lib/generateJWT.js";


export const createUser = async (req, res) => {
    try {
        const {users} = req.body;

        const currentUser = req.user;

        if (currentUser.role !== ROLES.ROOT && currentUser.role !== ROLES.TEACHER) {
            return res.status(403).json({message: "Brak uprawnień do dodawania użytkowników"});
        }

        if (!users || !Array.isArray(users) || users.length === 0) {
            return res.status(400).json({message: "Lista użytkowników jest wymagana"});
        }



        if (!process.env.FIRST_PASSWORD) {
            return res.status(500).json({message: "Brak FIRST_PASSWORD w pliku konfiguracyjnym"});
        }

        const hashedPassword = await bcrypt.hash(process.env.FIRST_PASSWORD, 10);

        const newUsersData = users.map((user) => {
            if (!user.username || !user.role) {
                return res.status(400).json({message: "Każdy użytkownik musi mieć 'username' i 'role'"});
            }

            return {
                username: user.username,
                password: hashedPassword,
                role: user.role,
                createdByTeacherId: currentUser.id,
            };
        });

        const createdUsers = await prisma.user.createMany({
            data: newUsersData,
            skipDuplicates: true,
        });

        const skipped = newUsersData.length - createdUsers.count;


        return res.status(201).json({
            message:
                skipped > 0
                    ? `Część użytkowników nie została dodana (${skipped} duplikaty)`
                    : "Użytkownicy zostali dodani pomyślnie",
            createdCount: createdUsers.count,
            skippedCount: skipped,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Wystąpił błąd podczas dodawania użytkowników"});
    }
};
export const login = async (req, res) => {
    const {username, password} = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({message: "Nazwa użytkownika lub hasło jest wymagane"});
        }

        const existingUser = await prisma.user.findUnique({
            where: {username},
            select: {
                id: true,
                username: true,
                role: true,
                hasOnboarded: true,
                firstName: true,
                lastName: true,
                password: true
            }
        });


        if (!existingUser) {
            return res.status(401).json({message: "Nieprawidłowy login lub hasło"});
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({message: "Nieprawidłowy login lub hasło"});
        }


        const token = signToken(existingUser.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        })
        const {password: _pwd, ...safeUser} = existingUser;
        return res.status(200).json({
            message: "Zalogowano pomyślnie",
            user: safeUser,
        });
    } catch (err) {
        return res.status(500).json({message: "Nie udało się zalogować"});
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