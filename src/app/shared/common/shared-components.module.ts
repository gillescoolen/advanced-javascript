import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { TableComponent } from '../components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BackButtonComponent } from "../components/back-button/back-button.component";


@NgModule({
  declarations: [TableComponent, BackButtonComponent],
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
    BackButtonComponent,
    ReactiveFormsModule
  ]
})
export class SharedComponentsModule {
  static forRoot(): ModuleWithProviders<SharedComponentsModule> {
    return {
      ngModule: SharedComponentsModule,
      providers: []
    };
  }
}
