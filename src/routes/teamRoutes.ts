import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Team } from "../models/Team";
import { User } from "../models/User";

const router = express.Router();

// GET /teams
router.get("/", async (req: Request, res: Response) => {
  try {
    const teamRepository = getRepository(Team);
    const teams = await teamRepository.find({ relations: ['users', 'tasks'] });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve teams' });
  }
});

// GET /teams/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teamRepository = getRepository(Team);
    const team = await teamRepository.findOne(id, { relations: ['users', 'tasks'] });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve team' });
  }
});

// PUT /teams/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, userIds } = req.body;
    const teamRepository = getRepository(Team);
    const userRepository = getRepository(User);
    const team = await teamRepository.findOne(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    team.name = name;
    team.users = await userRepository.findByIds(userIds);
    await teamRepository.save(team);
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team' });
  }
});

// POST /teams
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, userIds } = req.body;
    const teamRepository = getRepository(Team);
    const userRepository = getRepository(User);
    const team = new Team();
    team.name = name;
    team.users = await userRepository.findByIds(userIds);
    await teamRepository.save(team);
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// DELETE /teams/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teamRepository = getRepository(Team);
    const team = await teamRepository.findOne(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    await teamRepository.remove(team);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team' });
  }
});

export default router;
