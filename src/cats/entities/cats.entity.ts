import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cats {
 
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 40 })
  age: Number;

  @Column({ type: 'varchar' })
  breed: string;
}