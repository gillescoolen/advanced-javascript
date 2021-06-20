import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../types/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(@Inject(AngularFirestore) private firestore: AngularFirestore, @Inject(AngularFireAuth) private fireAuth: AngularFireAuth) {
  }

  one(id: string): Observable<User | undefined> {
    return this.firestore.collection<User>('users').doc(id).valueChanges();
  }


  public getUserRef(id: string) {
    return this.firestore.collection<User>('users').doc(id).ref;
  }

  all() {
    return this.firestore.collection<User>('users').valueChanges();
  }
}
