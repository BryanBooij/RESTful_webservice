import express from "express";
import Team from "../models/Team.js";
const router = express.Router();
import eredivisieTeams from '../seeder/eredivisieSeeder.js';

router.delete("/:id", async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.status(204).send();
    } catch (e) {
        res.status(400).json({
            message: "Invalid id",
            error: e.message
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (e) {
        res.status(400).json({
            message: "Team could not be made",
            error: e.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json(team);
    } catch (e) {
        res.status(400).json({
            message: "Update failed",
            error: e.message
        });
    }
});


router.get("/", async (req, res, ret) => {
    try {
        const Teams = await Team.find().select('title description imageUrl');
        res.json({
            items:Teams,
            _links: {
                self: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/teams`, // id word zelf gemaakt door mongoose
                },
                collection: {
                    href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/teams`, // collection linkt naar de hoofd pagina waar de informatie in komt te staan
                },
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch teams", error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        console.log(req.headers);
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "team not found" });
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(team);
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