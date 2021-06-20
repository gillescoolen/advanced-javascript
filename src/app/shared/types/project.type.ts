import { User } from './user';
import { DocumentReference } from '@angular/fire/firestore';

export type Project = {
  name: string,
  owner: DocumentReference<User>,
  members: { user: DocumentReference<User>, role: string }[],
  description: string,
  status: string,
  archived: boolean
};

export type ProjectDto = {
  name: string,
  owner: string,
  ownerId: string,
  description: string,
  status: string,
  archived: boolean
};
