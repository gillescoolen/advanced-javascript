import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { UserResolver } from './core/resolvers/user.resolver';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((module) => module.AuthModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project',
    resolve: { user: UserResolver },
    loadChildren: () => import('./features/project/project.module').then((module) => module.ProjectModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'archived',
    resolve: { user: UserResolver },
    loadChildren: () => import('./features/archived/archived.module').then((module) => module.ArchivedModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: '**',
    component: LayoutComponent,
    children: [
      {
        path: '**',
        component: NotFoundComponent
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
