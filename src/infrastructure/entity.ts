import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    dateCreated: Date
}