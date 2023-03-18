import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('moviment')
export class Moviment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usedliterage: number;

    @Column()
    currentliterage: number;

    @Column()
    actionid: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdat: Date;
}