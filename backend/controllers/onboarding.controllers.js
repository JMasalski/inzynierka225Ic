import prisma from "../lib/prismaClient.js";
import * as bcrypt from "bcryptjs";
export const completeOnboarding = async (req, res) =>{
    try{
        const {firstName, lastName, password} = req.body;
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
    }
}