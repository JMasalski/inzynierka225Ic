import { ROLES } from "../lib/roles.js";

export const isTeacherOrRoot = (req, res, next) => {
    const requestingUser = req.user;

    if (!requestingUser) {
        return res.status(401).json({ message: "Brak autoryzacji" });
    }

    if (
        requestingUser.role !== ROLES.ROOT &&
        requestingUser.role !== ROLES.TEACHER
    ) {
        return res.status(403).json({ message: "Brak uprawnień" });
    }

    next();
};
