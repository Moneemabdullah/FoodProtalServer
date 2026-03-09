import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.all("/api/auth/*", toNodeHandler(auth));
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});
app.get("/api/user", async (req, res) => {
    const session = req.headers.authorization;
    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await auth.api.getSession({
        headers: { authorization: session },
    });
    if (!user) {
        return res.status(401).json({ error: "Invalid session" });
    }
    res.json(user);
});
async function main() {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
main().catch(console.error);
//# sourceMappingURL=index.js.map