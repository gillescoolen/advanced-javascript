import { Task } from './task.type';

export type Member = {
  id: string,
  name: string,
  assigned: Task[]
};

export type AbstractMember = {
  id: string,
  name: string,
  role: string
};
