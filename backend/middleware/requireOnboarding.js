export const requireOnboarding = (req,res,next) =>{
    if (!req.user.hasOnboarded){
        return res.status(403).json({message:"Użytkownik musi ukończyć onboarding"})
    }
}