import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('actions')
export class Action {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string;

    @CreateDateColumn()
    createdat: Date;
}