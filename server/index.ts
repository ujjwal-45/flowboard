import { createServer } from "http";

import express from "express";
import next, { NextApiHandler } from 'next'

const port = parseInt(process.env.port || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app = express();
    const server = createServer(app);

    app.all("*", (req: any, res: any) => nextHandler(req, res));

    app.listen(port, () => {
        console.log(`The server is listening at port ${port}`);
    });
});

