import type { NextFunction, Request, Response } from "express";

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
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        next();
    };
};
