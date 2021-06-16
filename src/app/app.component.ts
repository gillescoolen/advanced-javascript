import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Task } from './task/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  todo = getObservable(this.store.collection('todo')) as Observable<Task[]>;
  inReview = getObservable(this.store.collection('inReview')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => this.store.collection('todo').add(result.task));
  }

  editTask(list: 'done' | 'todo' | 'inProgress' | 'inReview', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (result.delete) this.store.collection(list).doc(task.id).delete();
      else this.store.collection(list).doc(task.id).update(task);
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer.data === null || event.container.data === null) return;
    if (event.previousContainer === event.container) return;
   
    const item = event.previousContainer.data[event.previousIndex];
    
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);

      return promise;
    });
    
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
