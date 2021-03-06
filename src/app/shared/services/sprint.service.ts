import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProjectService } from './project.service';
import { map, mergeMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { Project } from '../types/project.type';
import { Member } from '../types/member.type';
import { SprintDto, CreateSprint, Sprint } from '../types/sprint.type';
import firebase from 'firebase';
import { Task } from '../types/task.type';
import * as moment from 'moment';
import Timestamp = firebase.firestore.Timestamp;
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  constructor(
    @Inject(AngularFirestore)
    private readonly firestore: AngularFirestore,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  ) { }

  getSprintById(projectId: string, sprintId: string) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .doc(sprintId)
      .valueChanges();
  }

  getAll(projectId: string): Observable<SprintDto[]> {
    return this.firestore.collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .snapshotChanges()
      .pipe(map(sprints => {
        return sprints.map(sprint => {
          const data = sprint.payload.doc.data();
          return {
            title: data.title,
            description: data.description,
            startDate: moment(data.startDate.toDate()).format('YYYY-MM-DD'),
            endDate: moment(data.endDate.toDate()).format('YYYY-MM-DD'),
            active: data.active,
            id: sprint.payload.doc.id
          };
        });
    }));
  }

  getTasks(projectId: string): Observable<Task[]> {
    return this.getActiveSprint(projectId)
      .pipe(mergeMap(sprint => {
        if (!sprint) return of([]);

        return combineLatest(sprint[0].tasks.map(ref => {
          const tasks = this.firestore
            .collection<Project>('projects')
            .doc(projectId)
            .collection<Task>('tasks')
            .doc(ref.id)
            .valueChanges();

          return tasks.pipe(map(task => ({
            ...task,
            id: ref.id
          })));
        }));
      }), map(tasks => tasks.filter(task => !task.archived)));
  }

  getUsersAndTasks(projectId: string): Observable<Member[]> {
    const tasks$ = this.getTasks(projectId);

    return this.projectService
      .getProjectById(projectId)
      .pipe(mergeMap(project => {
        if (!project) return of([]);

        return combineLatest(project.members.map(member => {
          return this.userService
            .getUserById(member.user.id)
            .pipe(mergeMap(memberData => {
              const assigned$ = tasks$.pipe(
                map(t => t.filter(task => task.assigned?.id === member.user.id))
              );

              return assigned$.pipe(map(assigned => ({
                id: member.user.id,
                name: memberData?.displayName ?? 'Unknown',
                assigned: assigned.map(a => ({
                  ...a
                }))
            })));
          }));
        }));
    }));
  }

  async updateStory(task: Task, projectId: string) {
    const payload = {
      title: task.title,
      description: task.description,
      status: task.status,
      assigned: task.assigned,
      points: task.points,
      archived: task.archived,
      updatedAt: Timestamp.now()
    };
    await this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .collection<Partial<Task>>('tasks')
      .doc(task.id)
      .update(payload);
  }

  getActiveSprint(id: string) {
    return this.firestore
      .collection('projects')
      .doc(id).collection<Sprint>('sprints', query => {
        return query
          .where('active', '==', true)
          .limit(1);
    }).valueChanges();
  }

  async createSprint(data: Partial<CreateSprint>, projectId: string) {
    const tasks: DocumentReference<Task>[] = [];

    for (const task of data.tasks) 
      tasks.push(this.firestore
        .collection<Project>('projects')
        .doc(projectId)
        .collection<Task>('tasks')
        .doc(task).ref
      );

    if (data.active) await this.deactivateAll(projectId);

    const payload = {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      tasks,
      active: data.active
    }

    return await this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .add(payload);
  }

  async updateSprint(data: Partial<CreateSprint>, projectId: string, sprintId: string) {
    const tasks: DocumentReference<Task>[] = [];

    for (const task of data.tasks) 
      tasks.push(this.firestore
        .collection('projects')
        .doc(projectId)
        .collection<Task>('tasks')
        .doc(task).ref
      );

      
    if (data.active) await this.deactivateAll(projectId);

    const payload = {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      tasks,
      active: data.active
    }

    return await this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .doc(sprintId)
      .update(payload);
  }

  async deactivateAll(id: string) {
    const sprints = await this.firestore
      .collection<Project>('projects')
      .doc(id).collection<Sprint>('sprints',
        query => query.where('active', '==', true))
      .ref.get();

    for (const sprint of sprints.docs)
      await this.firestore
        .collection<Project>('projects')
        .doc(id)
        .collection<Sprint>('sprints')
        .doc(sprint.id)
        .update({ active: false });
  }
}