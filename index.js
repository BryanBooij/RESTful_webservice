import mongoose from "mongoose";
import express from 'express';
import spotsRouter from './routes/team.js';

try {
    // manually accept options cors
    const app = express();
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    app.options("/teams", (req, res) => {
        res.header("Allow", "GET,POST,OPTIONS");
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        res.header("Access-Control-Allow-Origin", "*");
        res.status(204).send();
    });

    app.options("/teams/:id", (req, res) => {
        res.header("Allow", "GET,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
        res.header("Access-Control-Allow-Origin", "*");
        res.status(204).send();
    });

    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`,{
        serverSelectionTimeoutMS: 3000
    });

    //Middleware to support application/json Content-Type
    app.use(express.json())

    //Middleware to support application/x-www-form-urlencoded Content-Type
    app.use(express.urlencoded({extended:true}));

    app.use((req, res, next) => {
        const acceptHeader = req.headers["accept"];

        // OPTIONS requests altijd doorlaten
        if (req.method === "OPTIONS") return next();

        if (!acceptHeader || !acceptHeader.includes("application/json")) {
            // 406 = Not Acceptable
            return res.status(406).json({ error: "only json is allowed" });
        }

        next();
    });

    app.use('/teams', spotsRouter);

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server werkt op poort: ${process.env.EXPRESS_PORT}`)
    })
} catch (e) {
    console.log(e);
}
