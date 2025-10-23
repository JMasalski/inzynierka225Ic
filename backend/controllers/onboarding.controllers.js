import prisma from "../lib/prismaClient.js";
import * as bcrypt from "bcryptjs";
export const completeOnboarding = async (req, res) =>{
    try{
        const {firstName, lastName, password} = req.body;
        if (!firstName || !lastName || !password){
            return res.status(400).json({message: "Wszystkie pola są wymagane"});
        }
        if (firstName.trim().length === 0||firstName.trim().length === 0){
            return res.status(400).json({message: "Imię i nazwisko nie mogą być puste"})
        }
        if (password.length < 8){
            return res.status(400).json({message:"Hasło musi mieć conajmniej 8 znaków"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where:{id:req.user.id},
            data:{
                firstName:firstName,
                lastName:lastName,
                password:hashedPassword,
                hasOnboarded:true
            }
        })
        res.status(200).json({ message:"Onboarding zakończony sukcesem"})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Błąd podczas ukończenia onboardingu"})
    }
}