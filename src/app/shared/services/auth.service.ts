import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../types/user';
import firebase from 'firebase';
import { EMPTY, Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null | undefined>;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly firestore: AngularFirestore
  ) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap((user) => user ? this.firestore.doc<User>(`users/${user.uid}`).valueChanges() : of(null))
    );
  }

  private async emailLogin() {
    const user = await this.fireAuth.signInWithPopup(new auth.EmailAuthProvider());

    return this.updateUser(user.user);
  }

  async logout() {
    await this.fireAuth.signOut();
    return this.router.navigate(['/auth/login']);
  }

  public updateUser({uid, email, displayName}: User) {
    const ref: AngularFirestoreDocument<User> = this.firestore.doc(`users/${uid}`);

    const user = {
      uid,
      email,
      displayName
    };

    return ref.set(user, { merge: true });
  }

  public getUser(userId: string): Observable<User | undefined> {
    return this.firestore.doc<User>(`users/${userId}`).valueChanges({idField: 'id'});
  }

  public getCurrentUser() {
    return this.fireAuth.authState.pipe(first(), switchMap(user => user ? this.getUser(user.uid).pipe(first()).toPromise() : EMPTY)).toPromise();
  }

  public getRef(user: User) {
    return this.firestore.collection<User>('users').doc(user?.uid).ref;
  }
}
