import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum Role {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN",
    PROVIDER = "PROVIDER",
}

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

            req.user = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role as Role,
                name: session.user.name,
                emailVerified: session.user.emailVerified,
            };

            if (
                roles.length > 0 &&
                !roles.includes(session.user.role as Role)
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};
