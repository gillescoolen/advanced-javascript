import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { TableComponent } from '../components/table/table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BackButtonComponent } from "../components/back-button/back-button.component";


@NgModule({
  declarations: [SpinnerComponent, TableComponent, BackButtonComponent],
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  exports: [CommonModule, RouterModule, MaterialModule, TableComponent, SpinnerComponent, ReactiveFormsModule, BackButtonComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
