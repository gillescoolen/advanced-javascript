import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { LayoutModule as AngularLayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../common/shared.module';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent],
  imports: [RouterModule, CommonModule, AngularLayoutModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, SharedModule.forRoot()],
  exports: [LayoutComponent]
})
export class LayoutModule {
  static forRoot(): ModuleWithProviders<LayoutModule> {
    return {
      ngModule: LayoutModule,
      providers: []
    };
  }
}
