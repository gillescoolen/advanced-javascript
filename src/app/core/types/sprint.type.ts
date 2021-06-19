import { DocumentReference } from '@angular/fire/firestore';
import { UserStory } from './user-story.type';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type Sprint = {
  title: string,
  endAt: Timestamp | null,
  startAt: Timestamp,
  tasks: DocumentReference<UserStory>[] | undefined,
  description: string,
  active: boolean
};

export type AbstractSprint = {
  id: string,
  title: string,
  endAt: string,
  startAt: string,
  description: string,
  active: boolean
};

export type CreateSprint = {
  active: boolean,
  title: string,
  endAt: Timestamp | null,
  startAt: Timestamp,
  tasks: string[],
  description: string
};
