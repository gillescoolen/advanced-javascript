import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { ProjectDto, Project } from '../types/project.type';
import { map, mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { User } from '../types/user';
import { AuthService } from './auth.service';
import { Role } from '../types/role.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    @Inject(AngularFirestore)
    private readonly firestore: AngularFirestore,
    private readonly authService: AuthService,
    private readonly userService: UserService
  )
  {}

  async createProject(user: User, project: Partial<Project>) {
    const ref = this.authService.getRef(user);

    const payload = {
      name: project.name,
      members: [{ user: ref, role: Role.MANAGER }],
      flatMembers: [ref.id],
      description: project.description ?? '',
      status: project.status ?? '',
      owner: ref,
      archived: false
    }

    return this.firestore
      .collection<Project>('projects')
      .doc()
      .set(payload);
  }

  async updateProject(projectId: string, project: Partial<Project>) {
    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .update(project);
  }

  getProjects(user: User, archived: boolean): Observable<ProjectDto[]> {
    const roles = [
      { user: this.authService.getRef(user), role: Role.MANAGER },
      { user: this.authService.getRef(user), role: Role.DEVELOPER },
      { user: this.authService.getRef(user), role: Role.CUSTOMER }
    ]
    
    return this.firestore.collection<Project>('projects', query => {
      return query
        .where('members', 'array-contains-any', roles)
        .where('archived', '==', archived);
    })
      .snapshotChanges()
      .pipe(mergeMap(projects => {
        return combineLatest(projects.map(project => {
          const projectData = project.payload.doc.data();

          const data = {
            id: project.payload.doc.id,
            name: projectData.name,
            description: projectData.description,
            status: projectData.status,
            archived: projectData.archived
          }

          return this.userService
            .getUserById(projectData.owner.id).pipe(map(owner => ({
              ...data,
              owner: owner?.displayName ?? '',
              ownerId: owner.uid,
            })
          ));
        }));
      }));
  }

  getProjectById(projectId: string): Observable<Project | undefined> {
    return this.firestore
      .collection<Project>('projects')
      .doc(projectId)
      .valueChanges();
  }

  getNonMembers(projectId: string) {
    return this.getProjectById(projectId).pipe(mergeMap(project => {
      const memberIds = project.members.map(m => m.user.id);
      return this.userService.getAllUsers().pipe(map(user => user.filter(u => !memberIds.includes(u.uid))));
    }));
  }

  getProjectOwner(projectId: string) {
    return this.getProjectById(projectId).pipe(map(project => project.owner));
  }
}
