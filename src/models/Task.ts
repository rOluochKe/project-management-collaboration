import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Project } from "./Project";
import { Team } from "./Team";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: ["backlog", "in-progress", "finished"],
    default: "backlog"
  })
  stage!: string;

  @Column("simple-array")
  tags!: string[];

  @ManyToOne(() => Project, project => project.tasks)
  project!: Project;

  @ManyToOne(() => Team, team => team.tasks)
  team: Team | null = null;

  @ManyToOne(() => User, user => user.ownedTasks)
  owner: User | null = null;

  @ManyToMany(() => User, user => user.accountableTasks)
  @JoinTable()
  accountables!: User[];

  @ManyToMany(() => User, user => user.subscribedTasks)
  @JoinTable()
  subscribers!: User[];
}
