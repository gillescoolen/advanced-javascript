import { UserStory } from './user-story.type';

export type Member = {
  id: string,
  name: string,
  assigned: UserStory[]
};

export type AbstractMember = {
  id: string,
  name: string,
  role: string
};
