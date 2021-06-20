import { DocumentReference } from '@angular/fire/firestore';
import { Task } from './task.type';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type Sprint = {
  title: string,
  description: string,
  startDate: Timestamp,
  endDate: Timestamp,
  tasks: DocumentReference<Task>[] | undefined,
  active: boolean
};

export type SprintDto = {
  id: string,
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  active: boolean
};

export type CreateSprint = {
  title: string,
  description: string,
  startDate: Timestamp,
  endDate: Timestamp,
  tasks: string[],
  active: boolean
};
