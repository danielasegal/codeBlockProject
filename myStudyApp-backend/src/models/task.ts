import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("task")
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  case: string;

  @Column()
  expectedResult: string;
}
