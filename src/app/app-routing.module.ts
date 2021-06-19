import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedInGuard } from './core/guards/not-logged-in.guard';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { UserResolver } from './core/resolvers/user.resolver';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((module) => module.AuthModule),
    canActivate: [NotLoggedInGuard]
  },
  {
    path: 'project',
    resolve: { user: UserResolver },
    loadChildren: () => import('./modules/project/project.module').then((module) => module.ProjectModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'archived',
    resolve: { user: UserResolver },
    loadChildren: () => import('./modules/archived/archived.module').then((module) => module.ArchivedModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    component: LayoutComponent,
    children: [
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}