import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { TableComponent } from '../components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TableComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
