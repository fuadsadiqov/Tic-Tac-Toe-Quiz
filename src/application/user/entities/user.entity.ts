import { BaseEntity } from 'src/infrastructure/entity';
import { Entity, Column } from 'typeorm';

enum Role{
  User = 1,
  Admin
}

@Entity()
export class User extends BaseEntity{
  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: "int", default: Role.User })
  role: Role = Role.User;
}