import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Project } from '../types/project.type';
import { Status } from '../types/task.enum';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import {
  BaseTask,
  TaskFormDTO,
  Task,
  TaskCreateDTO,
  TaskEditDTO
} from '../types/task.type';
import { ProjectService } from './project.service';
import { User } from '../types/user';
import firebase from 'firebase';
import { Sprint } from '../types/sprint.type';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  constructor(
    @Inject(AngularFirestore)
    private readonly firestore: AngularFirestore,
    private readonly userService: UserService,
    private readonly projectService: ProjectService) {
  }

  getByProject(id: string, archived = false, excludeId: string = '') {
    return this.firestore
      .collection<Project>('projects')
      .doc(id)
      .collection<Sprint>('sprints')
      .snapshotChanges()
      .pipe(mergeMap(sprints => {
        const array = sprints.map(sprint => sprint.payload.doc.data().tasks && sprint.payload.doc.id !== excludeId ?
          sprint.payload.doc.data().tasks.map(task => task.id) : []);
        const flatten = ['1'].concat(...array);

        return this.firestore
          .collection<Project>('projects')
          .doc(id)
          .collection<Task>('backlog', q => {
            return q.where('archived', '==', archived)
              .where(firebase.firestore.FieldPath.documentId(), 'not-in', flatten);
          })
          .snapshotChanges()
          .pipe(map(tasks => tasks.map(t => ({
            ...t.payload.doc.data(),
            id: t.payload.doc.id
          }))));
      }));
  }

  getByProjectAbstract(id: string, archived = false): Observable<BaseTask[]> {
    return this.firestore
      .collection<Project>('projects')
      .doc(id)
      .collection<Task>('backlog', q => {
        return q.where('archived', '==', archived);
      })
      .snapshotChanges()
      .pipe(mergeMap(userStories => {
        return combineLatest(userStories.map(userStory => {
          const data = userStory.payload.doc.data();
          const assignee = data.assignee != null ? this.userService.one(data.assignee.id).pipe(map(user => user?.displayName)) : of('');

          return assignee.pipe(map(name => ({
            id: userStory.payload.doc.id,
            title: data.title,
            description: data.description,
            status: data.status,
            assignee: name,
            storyPoints: data.storyPoints,
            archived: data.archived
          })));
        }));
      }));
  }

  async create(id: string, userStory: TaskCreateDTO) {
    const userRef = userStory.assignee === undefined ? null : this.userService.getUserRef(userStory.assignee);

    return this.firestore
      .collection<Project>('projects')
      .doc(id)
      .collection<Partial<Task>>('backlog')
      .doc()
      .set({
        title: userStory.title,
        archived: false,
        status: Status.BACKLOG,
        description: userStory.description,
        assignee: userRef,
        storyPoints: userStory.storyPoints,
        updatedAt: Timestamp.now()
      });
  }

  getOneWithUserData(projectId: string, userStoryId: string): Observable<TaskFormDTO> {
    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Task>('backlog')
      .doc(userStoryId)
      .valueChanges()
      .pipe(mergeMap(story => {
        return story.assignee ? this.userService.one(story.assignee.id).pipe(
          map(user => ({
            id: userStoryId,
            ...story,
            assignee: user
          }))
        ) : of({
          id: userStoryId,
          ...story,
          assignee: null
        });
      }));
  }

  async editUserStory(projectId: string, userStoryId: string, data: TaskEditDTO) {
    const userRef = data.assignee === undefined ? null : this.userService.getUserRef(data.assignee);

    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Task>('backlog')
      .doc(userStoryId)
      .update({
        title: data.title,
        description: data.description,
        assignee: userRef,
        storyPoints: data.storyPoints,
        archived: data.archived,
        updatedAt: Timestamp.now()
      });
  }

  getProjectMembers(id: string) {
    return this.projectService.oneById(id).pipe(mergeMap(project => {
      if (!project) {
        return of([]);
      }

      return combineLatest(project.members.map(member => {
        return this.firestore.collection<User>('users').doc(member.user.id)
          .valueChanges();
      }));
    }));
  }
}
