import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];

  @ManyToMany(() => User, user => user.projects)
  @JoinTable()
  users!: User[];
}
