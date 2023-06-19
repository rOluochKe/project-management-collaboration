import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../models/User";

const router = express.Router();

// GET /users
router.get("/", async (req: Request, res: Response) => {
  try {
    const userRepository = getRepository(User);
    const users = await userRepository.find({ relations: ['teams', 'ownedTasks', 'accountableTasks', 'subscribedTasks', 'projects'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

// GET /users/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id, { relations: ['teams', 'ownedTasks', 'accountableTasks', 'subscribedTasks', 'projects'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
});


// PUT /users/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name;
    await userRepository.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// POST /users
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userRepository = getRepository(User);
    const user = new User();
    user.name = name;
    await userRepository.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// DELETE /users/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await userRepository.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});


export default router;
