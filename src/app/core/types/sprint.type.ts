import { DocumentReference } from '@angular/fire/firestore';
import { UserStory } from './user-story.type';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type Sprint = {
  title: string,
  description: string,
  startDate: Timestamp,
  endDate: Timestamp,
  tasks: DocumentReference<UserStory>[] | undefined,
  active: boolean
};

export type AbstractSprint = {
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
