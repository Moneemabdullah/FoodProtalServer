import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import config from "../config/index";
import prisma from "./prisma";

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
    host: config.AppHost,
    port: Number(config.AppPort),
    auth: {
        user: config.AppUser,
        pass: config.AppPassword,
    },
});

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
                const info = await transport.sendMail({
                    from: '"Food Portal" <no-reply@foodportal.com>',
                    to: user.email,
                    subject: "Verify Your Food Portal Account!",
                    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff8f0;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      border-top: 6px solid #ff6b3c;
    }

    .header {
      text-align: center;
      padding: 30px 20px;
      background-color: #ff6b3c;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    .content {
      padding: 30px 25px;
      line-height: 1.6;
      color: #555555;
    }

    .content h2 {
      margin-top: 0;
      font-size: 22px;
      color: #ff6b3c;
    }

    .content p {
      margin: 15px 0;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background-color: #ff6b3c;
      color: #ffffff !important;
      padding: 16px 32px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 8px;
      display: inline-block;
      font-size: 16px;
      transition: background-color 0.2s ease;
    }

    .verify-button:hover {
      background-color: #e65a2b;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #999999;
      background-color: #fff8f0;
    }

    .link {
      word-break: break-all;
      font-size: 13px;
      color: #ff6b3c;
    }

    @media screen and (max-width: 600px) {
      .container { margin: 20px; }
      .content { padding: 20px; }
      .verify-button { width: 100%; padding: 14px; font-size: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Food Portal</h1>
    </div>

    <div class="content">
      <h2>Hello ${user.name},</h2>
      <p>Welcome to <strong>Food Portal</strong>! 🍔🍕🥗</p>
      <p>Please verify your email to start ordering your favorite meals.</p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">Verify My Email</a>
      </div>

      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p class="link">${verificationUrl}</p>

      <p>Enjoy a delicious experience with Food Portal!</p>
      <p>Cheers, <br/><strong>The Food Portal Team</strong></p>
    </div>

    <div class="footer">
      © 2026 Food Portal. All rights reserved.
    </div>
  </div>
</body>
</html>`,
                });
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
