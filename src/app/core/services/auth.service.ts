import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from './user';
import firebase from 'firebase';
import { EMPTY, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
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
      switchMap((user) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async emailLogin() {
    return this.login(new auth.EmailAuthProvider());
  }

  async googleSignIn() {
    return this.login(new auth.GoogleAuthProvider());
  }

  private async login(provider) {
    const credential = await this.fireAuth.signInWithPopup(provider);
    
    return this.updateUserData(credential.user);
  }

  async logout() {
    await this.fireAuth.signOut();
    return this.router.navigate(['/auth/login']);
  }

  public updateUserData({uid, email, displayName}: User) {
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${uid}`);

    const data: User = {
      uid,
      email,
      displayName
    };

    return userRef.set(data, {
      merge: true
    });
  }

  public getUser(userId: string): Observable<User | undefined> {
    return this.firestore.doc<User>(`users/${userId}`).valueChanges({idField: 'id'});
  }

  public getCurrentUser() {
    return this.fireAuth.authState.pipe(first(), switchMap(user => {
      if (user) return this.getUser(user.uid).pipe(first()).toPromise();

      return EMPTY;
    })).toPromise();
  }

  public getUserRef(user: User) {
    return this.firestore.collection<User>('users').doc(user?.uid).ref;
  }
}
