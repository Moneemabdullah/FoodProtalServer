import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import config from "../config/index.js";
import { sendVerificationEmail } from "../utils/email.utils.js";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    baseURL: config.BaseUrl,
    trustedOrigins: config.allowedOrigins,
    advanced: {
        useSecureCookies: config.isSecureAuth,
        trustedProxyHeaders: config.isProduction,
        defaultCookieAttributes: {
            httpOnly: true,
            sameSite: config.isSecureAuth ? "none" : "lax",
            secure: config.isSecureAuth,
            path: "/",
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
        },
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${config.BaseUrl}/api/auth/verify-email?token=${token}`;
                const info = await sendVerificationEmail(user, verificationUrl);
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
    },

    socialProviders: {
        google: {
            enabled: true,
            clientId: config.GoogleClientId,
            clientSecret: config.GoogleClientSecret,
        },
    },
});

export type Auth = typeof auth;
