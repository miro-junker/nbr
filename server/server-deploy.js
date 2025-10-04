import express from "express";
import { exec } from "child_process";


export default function createDeployRouter({
    tokenCheckEnabled = false,
    secret = "",
} = {}) {
    const router = express.Router();

    router.all("/", (req, res) => {
        console.log(`Deploy attempt at ${new Date().toLocaleString()}`);

        // --- Token check ---
        if (tokenCheckEnabled) {
            const token = req.headers["x-deploy-token"];
            if (token !== secret) {
                console.error("Deploy token mismatch");
                return res.status(403).send("Forbidden");
            }
        }

        // --- Send response immediately ---
        res.send("Deploy started");

        // --- Run deploy script asynchronously ---
        const child = exec("./scripts/deploy.sh", (error, stdout, stderr) => {
            if (error) {
                console.error(`Deploy failed: ${error.message}`);
            }
            if (stdout) console.log("Deploy stdout:", stdout.trim());
            if (stderr) console.error("Deploy stderr:", stderr.trim());
        });

        child.unref();
    });

    return router;
}
