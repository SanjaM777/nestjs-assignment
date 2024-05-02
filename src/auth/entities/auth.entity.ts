import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;


  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;


  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'] })
  /**
   * a - admin
   * u - user
   */
  role: string;
}