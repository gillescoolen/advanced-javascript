import { User } from './user';
import { DocumentReference } from '@angular/fire/firestore';
import { Status } from './task.enum';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type Task = {
  id: string,
  title: string,
  description: string,
  status: Status
  assigned?: DocumentReference<User> | null,
  points: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type BaseTask = {
  title: string,
  description: string,
  status: Status
  assigned?: string | null,
  points: number,
  archived: boolean
};

export type TaskCreateDto = {
  title: string,
  description: string
  assigned: string | undefined,
  points: number
};

export type TaskFormDto = {
  id: string,
  title: string,
  description: string,
  assigned?: User | null
  points: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type TaskEditDto = {
  title: string,
  description: string
  assigned: string | undefined,
  points: number,
  archived: boolean,
};
