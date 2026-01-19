import express from "express";
import Team from "../models/Team.js";
import { faker } from '@faker-js/faker';
const router = express.Router();
import eredivisieTeams from '../seeder/eredivisieSeeder.js';

router.options('/', (req, res) =>{
    res.header('Allow', 'GET,POST,OPTIONS');
    res.status(204).send();
});
router.get("/", async (req, res, ret) => {
    try {
        const Teams = await Team.find().select('title description imageUrl');
        res.json({
            items:Teams,
            _links: {
                self: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/team`, // id word zelf gemaakt door mongoose
                },
                collection: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/team`, // collection linkt naar de hoofd pagina waar de informatie in komt te staan
                },
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch teams", error: e.message });
    }
});

router.options('/:id', (req, res) =>{
    res.header('Allow', 'PUT,DELETE');
    res.status(204).send();
});

router.get("/:id", async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        // const spot = await Spot.findOne(req.params.title);
        //antwan manier
        // if (spot === null){
        //     res.status(404).send();
        // }else{
        //     res.json(spot);
        // }
        //andere manier
        if (!team) {
            return res.status(404).json({ message: "team not found" });
        }
        res.json(team);
    } catch (e) {
        res.status(400).json({ message: "Invalid id", error: e.message });
    }
});


router.post('/seed', async (req, res) => {
    await Team.deleteMany({});

    await Team.insertMany(eredivisieTeams);

    res.json({
        message: 'Eredivisie teams succesvol geseed',
        count: eredivisieTeams.length,
    });
});

export default router;