import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToMany(() => User, user => user.teams)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Task, task => task.team, { nullable: true })
  tasks!: Task[];
}
