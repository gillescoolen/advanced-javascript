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
  constructor(@Inject(AngularFirestore) private firestore: AngularFirestore, private readonly projectService: ProjectService, private readonly userService: UserService) {
  }

  allAbstractFromProject(id: string) {
    return this.projectService.oneById(id).pipe(mergeMap(project => combineLatest(project.members.map(m => {
      return this.userService.one(m.user.id).pipe(map(user => ({
        id: m.user.id,
        name: user.displayName,
        role: m.role
      })));
    }))));
  }

  async addToProject(id: string, userId: string, role: string) {
    const project = await this.firestore.collection<Project>('projects').doc(id).ref.get();
    await this.firestore.collection<Project>('projects').doc(id).update({
      members: [...project.data().members, { user: this.userService.getUserRef(userId), role }],
      flatMembers: [...project.data().flatMembers, userId]
    });
  }

  async updateInProject(id: string, userId: string, role: string) {
    const project = await this.firestore.collection<Project>('projects').doc(id).ref.get();
    await this.firestore.collection<Project>('projects').doc(id).update({
      members: [...project.data().members.filter(m => m.user.id !== userId), { user: this.userService.getUserRef(userId), role }]
    });
  }
}
