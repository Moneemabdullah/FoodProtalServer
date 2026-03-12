import readline from "node:readline";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import prisma from "../lib/prisma";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

async function seedSuperUser() {
    try {
        console.log("**** Admin Seeding Started ****");

        const name = await ask("Enter admin name: ");
        const email = await ask("Enter admin email: ");
        const password = await ask("Enter admin password: ");

        if (!email || !password) {
            throw new Error("Email and password are required!");
        }

        const SuperUserData = {
            name: name || "admin",
            email,
            password,
            role: Role.ADMIN,
        };

        console.log("**** Checking for existing SuperUser ****");

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error("User already exists!");
        }

        const signUpSuperUser = await fetch(
            `${config.BaseUrl}/api/auth/sign-up/email`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    Origin: config.OriginUrl,
                },
                body: JSON.stringify(SuperUserData),
            },
        );

        const responseText = await signUpSuperUser.text();

        if (!signUpSuperUser.ok) {
            console.error("Signup API status:", signUpSuperUser.status);
            console.error("Signup API response:", responseText);
            throw new Error("Signup failed!");
        }

        console.log("******** Admin Created *******");

        await prisma.user.update({
            where: { email },
            data: { emailVerified: true },
        });

        console.log("**** Email verification updated ****");
        console.log("******* SUCCESS ******");
    } catch (Error) {
        console.error("❌ ERROR:", Error);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

seedSuperUser();
