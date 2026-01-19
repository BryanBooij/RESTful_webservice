import mongoose from "mongoose";
import express from 'express';
import spotsRouter from './routes/team.js';
import router from "./routes/team.js";

try {
    const app = express();
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`,{
        serverSelectionTimeoutMS: 3000
    });

    //Middleware to support application/json Content-Type
    app.use(express.json())

    //Middleware to support application/x-www-form-urlencoded Content-Type
    app.use(express.urlencoded({extended:true}));

    //middleware example 1
    app.use('/', (req, res, next) => {
        // manier 1
        // als het geen json is if anders else
        if (req.header('Accept') !== 'application/json' && req.method !=='OPTIONS'){
            res.status(406);
            res.json({error: 'only json is allowed'});
            return;
        }
        next();
    });
    //middleware example 2
    app.use('/example', (req, res, next) => {
        // manier 2
        const acceptHeader = req.headers["accept"];

        console.log(`Client accepteert: ${acceptHeader}`);

        if (acceptHeader.includes("application/json")) {
            res.json({ message: "Dit is een JSON-response" });
            next();
        } else {
            res.status(406).send({message: "deze app accepteerd alleen json"});
        }
    })

    app.use('/teams', spotsRouter);

    app.listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server werkt op poort: ${process.env.EXPRESS_PORT}`)
    })
} catch (e) {
    console.log(e);
}

