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
    private readonly afs: AngularFirestore,
    private readonly afAuth: AngularFireAuth,
    private readonly router: Router,
    private readonly firestore: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async emailSignIn() {
    return this.signIn(new auth.EmailAuthProvider());
  }

  async googleSignIn() {
    return this.signIn(new auth.GoogleAuthProvider());
  }

  private async signIn(provider) {
    const credential = await this.afAuth.signInWithPopup(provider);
    // @ts-ignore
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/auth/sign-in']);
  }

  public updateUserData({uid, email, displayName}: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

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
    return this.afAuth.authState.pipe(first(), switchMap(user => {
      if (user) {
        return this.getUser(user.uid).pipe(first()).toPromise();
      }

      return EMPTY;
    })).toPromise();
  }

  public getCurrentUserRef(user: User) {
    return this.firestore.collection<User>('users').doc(user?.uid).ref;
  }
}
