import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  phote: string;

  @Column()
  address: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'uid' }) //可以找到对应关系并生成 name默认为 名称+主键:userID（小驼峰）也可传参设置
  user: User;
}
