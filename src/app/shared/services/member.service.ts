import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mergeMap } from 'rxjs/operators';
import { ProjectService } from './project.service';
import { combineLatest } from 'rxjs';
import { UserService } from './user.service';
import { Project } from '../types/project.type';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(
    @Inject(AngularFirestore)
    private firestore: AngularFirestore,
    private readonly projectService: ProjectService,
    private readonly userService: UserService
  )
  {}

  getByProject(projectId: string) {
    return this.projectService
      .getProjectById(projectId)
      .pipe(mergeMap(project =>
        combineLatest(project.members.map(m => {
          return this.userService
            .getUserById(m.user.id)
            .pipe(map(user => ({
              id: m.user.id,
              name: user.displayName,
              role: m.role
            })
          ));
        }))
      ));
  }

  async addToProject(projectId: string, userId: string, role: string) {
    const project = await this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .ref.get();
    
    const members = [...project.data().members, { user: this.userService.getRef(userId), role }];
    const flatMembers = [...project.data().flatMembers, userId];

    await this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .update({
        members,
        flatMembers
      });
  }

  async updateInProject(projectId: string, userId: string, role: string) {
    const project = await this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .ref.get();
    
    const otherMembers = project.data().members.filter(m => m.user.id !== userId);
    const members = [
      ...otherMembers,
      {
        user: this.userService.getRef(userId),
        role
      }
    ]
    
    await this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .update({
        members
      });
  }
}
