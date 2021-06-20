import { User } from '../services/user';
import { DocumentReference } from '@angular/fire/firestore';
import { UserStoryStatus } from './user-story-status.enum';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export type UserStory = {
  id: string,
  title: string,
  description: string,
  status: UserStoryStatus
  assignee?: DocumentReference<User> | null,
  storyPoints: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type AbstractUserStory = {
  title: string,
  description: string,
  status: UserStoryStatus
  assignee?: string | null,
  storyPoints: number,
  archived: boolean
};

export type UserStoryCreateDTO = {
  title: string,
  description: string
  assignee: string | undefined,
  storyPoints: number,
  archived: boolean,
};

export type EditableUserStory = {
  id: string,
  title: string,
  description: string,
  assignee?: User | null
  storyPoints: number,
  archived: boolean,
  updatedAt: Timestamp
};

export type UserStoryEditDTO = {
  title: string,
  description: string
  assignee: string | undefined,
  storyPoints: number,
  archived: boolean,
};
