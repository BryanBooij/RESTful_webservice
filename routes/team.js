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
        // set base url for easier and more clean code
        const baseUrl = `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/teams`;
        // count the amount of teams
        const totalItems = await Team.countDocuments();
        // if there is no limit (no pagination) basic view
        if (!req.query.limit) {
            const teams = await Team.find().select("title description imageUrl locationType");
            return res.json({
                items: teams.map(team => ({
                    ...team.toObject(),
                    _links: {
                        self: { href: `${baseUrl}/${team._id}` },
                        collection: { href: baseUrl }
                    }
                })),
                _links: {
                    self: { href: baseUrl },
                    collection: { href: baseUrl }
                },
                pagination: {
                    currentPage: 1,
                    currentItems: teams.length,
                    totalPages: 1,
                    totalItems,
                    _links: {
                        first: { page: 1, href: baseUrl },
                        last: { page: 1, href: baseUrl },
                        previous: null,
                        next: null
                    }
                }
            });
        }

        // pagination view
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalItems / limit);
        const teams = await Team.find()
            .select("title description imageUrl locationType")
            .skip(skip)
            .limit(limit);

        // Map over each team document and add _links for self and collection
        const itemsWithLinks = teams.map(team => ({
            ...team.toObject(),
            _links: {
                self: { href: `${baseUrl}/${team._id}` },
                collection: { href: baseUrl }
            }
        }));

        // Build pagination links for navigation link to first page, last, next, previous or null if its the last or first page
        const paginationLinks = {
            first: { page: 1, href: `${baseUrl}?page=1&limit=${limit}` },
            last: { page: totalPages, href: `${baseUrl}?page=${totalPages}&limit=${limit}` },
            previous: page > 1 ? { page: page - 1, href: `${baseUrl}?page=${page - 1}&limit=${limit}` } : null,
            next: page < totalPages ? { page: page + 1, href: `${baseUrl}?page=${page + 1}&limit=${limit}` } : null
        };

        // Send the JSON response with pagination and self objects
        res.json({
            items: itemsWithLinks,
            _links: {
                self: { href: `${baseUrl}?page=${page}&limit=${limit}` },
                collection: { href: baseUrl }
            },
            // pagination
            pagination: {
                currentPage: page,
                currentItems: itemsWithLinks.length,
                totalPages,
                totalItems,
                _links: paginationLinks
            }
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch teams", error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
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