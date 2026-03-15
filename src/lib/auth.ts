import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import config from "../config/index";
import prisma from "./prisma";
import { sendVerificationEmail } from "../utils/email.utils";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [config.OriginUrl!],
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
        autoSignIn: false,
        // requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
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
