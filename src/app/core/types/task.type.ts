import { User } from '../services/user';
import { DocumentReference } from '@angular/fire/firestore';
import { Status } from './task.enum';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type Task = {
  id: string,
  title: string,
  description: string,
  status: Status
  assignee?: DocumentReference<User> | null,
  storyPoints: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type BaseTask = {
  title: string,
  description: string,
  status: Status
  assignee?: string | null,
  storyPoints: number,
  archived: boolean
};

export type TaskCreateDTO = {
  title: string,
  description: string
  assignee: string | undefined,
  storyPoints: number
};

export type TaskFormDTO = {
  id: string,
  title: string,
  description: string,
  assignee?: User | null
  storyPoints: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type TaskEditDTO = {
  title: string,
  description: string
  assignee: string | undefined,
  storyPoints: number,
  archived: boolean,
};
