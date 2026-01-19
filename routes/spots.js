import express from "express";
import Spot from "../models/Spot.js";
import { faker } from '@faker-js/faker';
const router = express.Router();

router.options('/', (req, res) =>{
    res.header('Allow', 'GET,POST,OPTIONS');
    res.status(204).send();
});
router.get("/", async (req, res, ret) => {
    try {
        const spots = await Spot.find().select('title description review');
        res.json({
            items:spots,
            _links: {
                self: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/spots`, // id word zelf gemaakt door mongoose
                },
                collection: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/spots`, // collection linkt naar de hoofd pagina waar de informatie in komt te staan
                },
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch spots", error: e.message });
    }
});

router.options('/:id', (req, res) =>{
    res.header('Allow', 'PUT,DELETE');
    res.status(204).send();
});

router.get("/:id", async (req, res) => {
    try {
        const spot = await Spot.findById(req.params.id);
        // const spot = await Spot.findOne(req.params.title);
        //antwan manier
        // if (spot === null){
        //     res.status(404).send();
        // }else{
        //     res.json(spot);
        // }
        //andere manier
        if (!spot) {
            return res.status(404).json({ message: "Spot not found" });
        }
        res.json(spot);
    } catch (e) {
        res.status(400).json({ message: "Invalid id", error: e.message });
    }
});


router.post('/seed', async(req, res) => {
    await Spot.deleteMany({}); // delete all rows to clear database
    // for loop to iterate the amount of times the seeder is run
    for (let i = 0; i < (req.body.amount || 1); i++) {
        await Spot.create({
            title: faker.book.title(),
            description: faker.commerce.productDescription(),
            review: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
            loc: faker.location.city(),
        });
    }
    res.status(201).send();
})

export default router;