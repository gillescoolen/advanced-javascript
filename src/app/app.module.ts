import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from './core/core.module';
import { SharedModule } from './core/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ArchivedModule } from './modules/archived/archived.module';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    ArchivedModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    SharedModule.forRoot(),
    CoreModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
