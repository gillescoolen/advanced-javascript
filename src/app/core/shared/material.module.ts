import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatGridListModule } from '@angular/material/grid-list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule,
    MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatCardModule, MatSortModule, MatGridListModule, DragDropModule, MatSlideToggleModule],
  exports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule,
    MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatCardModule, MatSortModule, MatGridListModule, DragDropModule, MatSlideToggleModule]
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders<MaterialModule> {
    return {
      ngModule: MaterialModule,
      providers: []
    };
  }
}
