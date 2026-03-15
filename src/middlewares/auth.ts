import type { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { auth as betterAuth } from "../lib/auth";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: Role;
                name: string;
                phone?: string;
                emailVerified: boolean;
            };
        }
    }
}

export const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as Request["headers"],
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email not verified",
                });
            }
            // console.log("Session User:", session.user);

            const userRole = session.user.role as Role;

            if (roles.length && !roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            req.user = {
                id: session.user.id,
                email: session.user.email,
                role: userRole,
                name: session.user.name,
                emailVerified: session.user.emailVerified,
            };

            // console.log("Authenticated User:", req.user);

            next();
        } catch (err) {
            next(err);
        }
    };
};
