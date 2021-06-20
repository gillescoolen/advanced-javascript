import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './shared/core.module';
import { SharedModule } from './shared/common/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ArchivedModule } from './features/archived/archived.module';
import { NotFoundComponent } from './features/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    ArchivedModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    CoreModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
