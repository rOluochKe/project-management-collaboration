import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Team } from "../models/Team";
import { Project } from '../models/Project';

const router = express.Router();

// GET /tasks
router.get("/", async (req: Request, res: Response) => {
  try {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository.find({ relations: ['project', 'team', 'owner', 'accountables', 'subscribers'] });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve tasks' });
  }
});

// GET /tasks/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOne(id, { relations: ['project', 'team', 'owner', 'accountables', 'subscribers'] });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve task' });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, stage, tags, projectId, teamId, ownerId, accountableIds, subscriberIds } = req.body;

    const taskRepository = getRepository(Task);
    const projectRepository = getRepository(Project);
    const teamRepository = getRepository(Team);
    const userRepository = getRepository(User);

    const task = await taskRepository.findOne(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.name = name;
    task.stage = stage;
    task.tags = tags;

    // Get associated project, team, owner, accountables, and subscribers
    const project = await projectRepository.findOne(projectId);
    const team = await teamRepository.findOne(teamId);
    const owner = await userRepository.findOne(ownerId);
    const accountables = await userRepository.findByIds(accountableIds);
    const subscribers = await userRepository.findByIds(subscriberIds);

    if (!project || !accountables || !subscribers) {
      return res.status(404).json({ message: 'Associated entities not found' });
    }

    if (team) {
      task.team = team;
      task.owner = null; // Clear the owner if a team is provided
    } else if (owner) {
      task.owner = owner;
      task.team = null; // Clear the team if an owner is provided
    } else {
      return res.status(400).json({ message: 'Invalid task ownership' });
    }

    task.project = project;
    task.accountables = accountables;
    task.subscribers = subscribers;

    const updatedTask = await taskRepository.save(task);

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update task." });
  }
});

// POST /tasks
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, stage, tags, projectId, teamId, ownerId, accountableIds, subscriberIds } = req.body;

    const taskRepository = getRepository(Task);
    const projectRepository = getRepository(Project);
    const teamRepository = getRepository(Team);
    const userRepository = getRepository(User);

    // Create a new task instance
    const task = new Task();
    task.name = name;
    task.stage = stage;
    task.tags = tags;

    // Get associated project, team, owner, accountables, and subscribers
    const project = await projectRepository.findOne(projectId);
    const team = await teamRepository.findOne(teamId);
    const owner = await userRepository.findOne(ownerId);
    const accountables = await userRepository.findByIds(accountableIds);
    const subscribers = await userRepository.findByIds(subscriberIds);

    if (!project || !accountables || !subscribers) {
      return res.status(404).json({ message: 'Associated entities not found' });
    }

    if (team) {
      task.team = team;
      task.owner = null; // Clear the owner if a team is provided
    } else if (owner) {
      task.owner = owner;
      task.team = null; // Clear the team if an owner is provided
    } else {
      return res.status(400).json({ message: 'Invalid task ownership' });
    }

    task.project = project;
    task.accountables = accountables;
    task.subscribers = subscribers;

    // Save the task to the database
    const createdTask = await taskRepository.save(task);

    return res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create task." });
  }
});


// DELETE /tasks/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskRepository = getRepository(Task);
    const task = await taskRepository.findOne(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await taskRepository.remove(task);

    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete task." });
  }
});

export default router;
