import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Task } from "./Task";
import { Team } from "./Team";
import { Project } from "./Project";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => Team, team => team.users)
  @JoinTable()
  teams!: Team[];

  @OneToMany(() => Task, task => task.owner)
  ownedTasks!: Task[];

  @ManyToMany(() => Task, task => task.accountables)
  accountableTasks!: Task[];

  @ManyToMany(() => Task, task => task.subscribers)
  subscribedTasks!: Task[];

  @ManyToMany(() => Project, project => project.users)
  @JoinTable()
  projects!: Project[];
}

