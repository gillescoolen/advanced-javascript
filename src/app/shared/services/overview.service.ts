import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { Project } from '../types/project.type';
import { Status } from '../types/task.enum';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import {
  BaseTask,
  TaskFormDto,
  Task,
  TaskCreateDto,
  TaskEditDto
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
        const array = sprints.map(sprint =>
          sprint.payload.doc.data().tasks && sprint.payload.doc.id !== excludeId
            ? sprint.payload.doc.data().tasks.map(task => task.id)
            : []
        );
        const flat = ['1'].concat(...array);

        return this.firestore
          .collection<Project>('projects')
          .doc(id)
          .collection<Task>('backlog', query => {
            return query
              .where('archived', '==', archived)
              .where(firebase.firestore.FieldPath.documentId(), 'not-in', flat);
          })
          .snapshotChanges()
          .pipe(map(tasks => tasks.map(task => ({
            ...task.payload.doc.data(),
            id: task.payload.doc.id
          }))));
      }));
  }

  getTasksByProject(id: string, archived = false): Observable<BaseTask[]> {
    return this.firestore
      .collection<Project>('projects')
      .doc(id)
      .collection<Task>('backlog', query => {
        return query
          .where('archived', '==', archived);
      })
      .snapshotChanges()
      .pipe(mergeMap(tasks => {
        return combineLatest(tasks.map(task => {
          const data = task.payload.doc.data();
          
          const payload = {
            id: task.payload.doc.id,
            title: data.title,
            description: data.description,
            status: data.status,
            points: data.points,
            archived: data.archived
          };

          const assigned = data.assigned != null
            ? this.userService
              .getUserById(data.assigned.id)
              .pipe(map(user => user?.displayName))
            : of('');

          return assigned.pipe(map(name => ({
            ...payload,
            assigned: name,
          })));
        }));
      }));
  }

  async create(projectId: string, task: TaskCreateDto) {
    const userRef =
      task.assigned === undefined
        ? null
        : this.userService.getRef(task.assigned);

    const project = {
      title: task.title,
      archived: false,
      status: Status.BACKLOG,
      description: task.description,
      assigned: userRef,
      points: task.points,
      updatedAt: Timestamp.now()
    }

    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Partial<Task>>('backlog')
      .doc()
      .set(project);
  }

  getOneWithUserData(projectId: string, taskId: string): Observable<TaskFormDto> {
    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Task>('backlog')
      .doc(taskId)
      .valueChanges()
      .pipe(mergeMap(task =>
        task.assigned
          ? this.userService
            .getUserById(task.assigned.id)
            .pipe(
              map(user => ({
                ...task,
                id: taskId,
                assigned: user
            }))
          )
          : of({
          ...task,
          id: taskId,
          assigned: null
        })
      ));
  }

  async editTask(projectId: string, taskId: string, data: TaskEditDto) {
    const ref = data.assigned === undefined
      ? null
      : this.userService.getRef(data.assigned);

    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Task>('backlog')
      .doc(taskId)
      .update({
        title: data.title,
        description: data.description,
        assigned: ref,
        points: data.points,
        archived: data.archived,
        updatedAt: Timestamp.now()
      });
  }

  getProjectMembers(projectId: string) {
    return this.projectService.getProjectById(projectId).pipe(mergeMap(project => {
      if (!project) return of([]);

      return combineLatest(project.members.map(member => {
        return this.firestore
          .collection<User>('users')
          .doc(member.user.id)
          .valueChanges();
      }));
    }));
  }
}
