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
    @Inject(AngularFirestore) private readonly firestore: AngularFirestore,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  )
  {}

  getSprintById(projectId: string, sprintId: string) {
    return this.firestore.collection('projects').doc(projectId).collection<Sprint>('sprints').doc(sprintId).valueChanges();
  }

  getAllSprints(projectId: string): Observable<SprintDto[]> {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .snapshotChanges()
      .pipe(map(sprints => {
        return sprints.map(s => {
          const sprint = s.payload.doc.data();
          
          return {
            title: sprint.title,
            description: sprint.description,
            startDate: this.format(sprint.startDate.toDate()),
            endDate: this.format(sprint.endDate.toDate()),
            active: sprint.active,
            id: s.payload.doc.id
          };
        });
    }));
  }

  getTasksBySprint(projectId: string): Observable<Task[]> {
    return this.getActiveSprint(projectId)
      .pipe(mergeMap(sprint => {
        if (!sprint) return of([]);

        return combineLatest(sprint[0].tasks.map(ref => {
          const tasks = this.firestore
            .collection<Project>('projects')
            .doc(projectId)
            .collection<Task>('overview')
            .doc(ref.id)
            .valueChanges();

          return tasks.pipe(map(
            task => ({
            ...task,
            id: ref.id
            })
          ));
        }));
      }), map(
        tasks =>
          tasks.filter(
            task =>
              task.archived === false
          )
      ));
  }

  getMembersAndTasks(id: string): Observable<Member[]> {
    const tasks$ = this.getTasksBySprint(id);

    return this.projectService
      .getProjectById(id)
      .pipe(mergeMap(project => {
        if (!project) return of([]);

        return combineLatest(project.members.map(member => {
          return this.userService
            .getUserById(member.user.id)
            .pipe(mergeMap(memberData => {
              const assigned$ = tasks$
                .pipe(map(pTask =>
                  pTask.filter(
                    task => task.assigned?.id === member.user.id)));

            return assigned$.pipe(map(assigned => ({
              id: member.user.id,
              name: memberData?.displayName ?? 'Unknown',
              assigned: assigned.map(assignedMember => ({
                ...assignedMember
              }))
            })));
          }));
        }));
    }));
  }

  async updateTask(task: Task, projectId: string) {
    const taskDto = {
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
      .collection<Partial<Task>>('overview')
      .doc(task.id)
      .update(taskDto);
  }

  getActiveSprint(projectId: string) {
    return this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints', query => 
        query
          .where('active', '==', true)
          .limit(1)
      )
      .valueChanges();
  }

  async createSprint(sprint: Partial<CreateSprint>, projectId: string) {
    const tasks: DocumentReference<Task>[] = [];

    for (const task of sprint.tasks)
      tasks.push(this.firestore
        .collection<Project>('projects')
        .doc(projectId)
        .collection<Task>('overview')
        .doc(task).ref
      );

    if (sprint.active) await this.deactivateSprint(projectId);

    const payload = {
      title: sprint.title,
      description: sprint.description,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      tasks,
      active: sprint.active
    }

    return await this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .add(payload);
  }

  async update(sprint: Partial<CreateSprint>, projectId: string, sprintId: string) {
    const tasks: DocumentReference<Task>[] = [];

    for (const task of sprint.tasks)
      tasks.push(this.firestore
        .collection('projects')
        .doc(projectId)
        .collection<Task>('overview')
        .doc(task)
        .ref
      );

    if (sprint.active) await this.deactivateSprint(projectId);

    const payload = {
      title: sprint.title,
      description: sprint.description,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      tasks,
      active: sprint.active
    };

    return await this.firestore
      .collection('projects')
      .doc(projectId)
      .collection<Sprint>('sprints')
      .doc(sprintId)
      .update(payload);
  }

  private async deactivateSprint(id: string) {
    const sprints = await this.firestore
      .collection<Project>('projects')
      .doc(id)
      .collection<Sprint>('sprints', query => query.where('active', '==', true))
      .ref.get();

    for (const sprint of sprints.docs) 
      await this.firestore
        .collection<Project>('projects')
        .doc(id)
        .collection<Sprint>('sprints')
        .doc(sprint.id)
        .update({ active: false });
  }

  private format(date: Date) {
    return moment(date).format('YYYY-MM-DD');
  }
}
