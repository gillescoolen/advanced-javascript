import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../types/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    @Inject(AngularFirestore)
    private firestore: AngularFirestore,
    @Inject(AngularFireAuth)
    private fireAuth: AngularFireAuth
  )
  {}

  getUserById(userId: string): Observable<User | undefined> {
    return this.firestore
      .collection<User>('users')
      .doc(userId)
      .valueChanges();
  }

  getRef(userId: string) {
    return this.firestore
      .collection<User>('users')
      .doc(userId).ref;
  }

  getAllUsers() {
    return this.firestore
      .collection<User>('users')
      .valueChanges();
  }
}
