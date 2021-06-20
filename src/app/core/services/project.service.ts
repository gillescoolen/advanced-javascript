import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { AbstractProject, Project } from '../types/project.type';
import { map, mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User } from './user';
import { AuthService } from './auth.service';
import { Role } from '../types/role.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(@Inject(AngularFirestore) private readonly firestore: AngularFirestore, private readonly authService: AuthService, private readonly userService: UserService) {
  }

  async create(user: User, project: Partial<Project>) {
    const ref = this.authService.getUserRef(user);

    return this.firestore.collection<Project>('projects').doc().set({
      name: project.name,
      members: [{ user: ref, role: Role.MANAGER }],
      flatMembers: [ref.id],
      description: project.description ?? '',
      status: project.status ?? '',
      owner: ref,
      archived: project.archived
    });
  }

  async update(id: string, project: Partial<Project>) {
    return this.firestore.collection<Project>('projects').doc(id).update(project);
  }

  allAbstract(user: User, archived = false): Observable<AbstractProject[]> {
    return this.firestore.collection<Project>('projects', query => {
      return query
        .where('members', 'array-contains-any', [
          { user: this.authService.getUserRef(user), role: Role.MANAGER },
          { user: this.authService.getUserRef(user), role: Role.DEVELOPER },
          { user: this.authService.getUserRef(user), role: Role.CUSTOMER }
        ])
        .where('archived', '==', archived);
    })
      .snapshotChanges()
      .pipe(mergeMap(projects => {
        return combineLatest(projects.map(project => {
          const data = project.payload.doc.data();
          return this.userService.one(project.payload.doc.data().owner.id).pipe(map(owner => ({
            id: project.payload.doc.id,
            name: data.name,
            owner: owner?.displayName ?? 'Unknown',
            ownerId: owner.uid,
            description: data.description,
            status: data.status,
            archived: data.archived
          })));
        }));
      }));
  }

  oneById(id: string): Observable<Project | undefined> {
    return this.firestore.collection<Project>('projects')
      .doc(id)
      .valueChanges();
  }

  allAvailableUsers(id: string) {
    return this.oneById(id).pipe(mergeMap(project => {
      const memberIds = project.members.map(m => m.user.id);
      return this.userService.all().pipe(map(user => user.filter(u => !memberIds.includes(u.uid))));
    }));
  }

  getOwner(id: string) {
    return this.oneById(id).pipe(map(project => project.owner));
  }
}
