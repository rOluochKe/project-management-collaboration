import express, { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Project } from "../models/Project";

const router = express.Router();

// GET /projects
router.get("/", async (req: Request, res: Response) => {
  try {
    const projectRepository = getRepository(Project);
    const projects = await projectRepository.find({ relations: ['tasks'] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve projects' });
  }
});

// GET /projects/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectRepository = getRepository(Project);
    const project = await projectRepository.findOne(id, { relations: ['tasks'] });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve project' });
  }
});

// PUT /projects/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const projectRepository = getRepository(Project);
    const project = await projectRepository.findOne(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = name;
    project.description = description;
    await projectRepository.save(project);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// POST /projects
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const projectRepository = getRepository(Project);
    const project = new Project();
    project.name = name;
    project.description = description;
    await projectRepository.save(project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// DELETE /projects/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projectRepository = getRepository(Project);
    const project = await projectRepository.findOne(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectRepository.remove(project);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
