import { Task } from './task.type';

export type Member = {
  id: string,
  name: string,
  assigned: Task[]
};

export type MemberDto = {
  id: string,
  name: string,
  role: string
};
