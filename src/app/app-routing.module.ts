import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoogleLoginComponent } from './auth/google-login/google-login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ProjectsResolver } from './shared/resolvers/all-projects.resolver';
import { ActiveProjectResolver } from './shared/resolvers/active-project.resolver';
import { ActiveDBSourceResolver } from './shared/resolvers/active-dbsource.resolver';
import { DBSourcesResolver } from './shared/resolvers/all-datasources';
import { AuthResolver } from './shared/resolvers/auth.resolver';
import { LoginComponent } from './auth/login/login.component';
import { GithubResolver } from './shared/resolvers/github-resolver';
import { GithubLoginComponent } from './auth/github-login/github-login.component';
import { EditorComponent } from './editor/editor.component';
import { EditorRedirectionComponent } from './editor/editor-redirection/editor-redirection.component';
import { CheckNewsletterResolver } from './shared/resolvers/check-newsletter.resolver';
import { PaymentComponent } from './auth/payment/payment.component';
import { ActiveIdentityProviderResolver } from './shared/resolvers/active-identityprovider.resolver';
import { IdentityProviderResolver } from './shared/resolvers/all-identityproviders';
import { AuthGuard } from './auth/auth.guard';
import { GoogleResolver } from './shared/resolvers/google-resolver';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'github/login', component: GithubLoginComponent, resolve: { githubResolver: GithubResolver } },
  { path: 'google/login', component: GoogleLoginComponent, resolve: { googleResolver: GoogleResolver } },
  { path: 'confirm/email/:token', component: LoginComponent, resolve: { authResolver: AuthResolver } },
  { path: 'checknewsletter/:userEmail', component: LoginComponent, resolve: { newsletterResolver: CheckNewsletterResolver } },
  { path: 'checknewsletter/:userEmail/editor', component: EditorComponent, resolve: { newsletterResolver: CheckNewsletterResolver } },
  { 
    path: 'app', 
    component: MainLayoutComponent, 
    canActivate: [AuthGuard], 
    resolve: { projectsList: ProjectsResolver, dbsourcesList: DBSourcesResolver, identityproviderList: IdentityProviderResolver } 
  },
  { 
    path: 'project', 
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule), 
    canActivate: [AuthGuard],
    resolve: { active: ActiveProjectResolver } 
  },
  { 
    path: 'dbsource', 
    loadChildren: () => import('./dbsource/dbsource.module').then(m => m.DBSourceModule), 
    canActivate: [AuthGuard],
    resolve: { active: ActiveDBSourceResolver } 
  },
  { 
    path: 'identityprovider', 
    loadChildren: () => import('./identity-provider/identityprovider.module').then(m => m.IdentityProviderModule), 
    canActivate: [AuthGuard],
    resolve: { active: ActiveIdentityProviderResolver } 
  },
  { 
    path: 'organization', 
    loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule), 
    canActivate: [AuthGuard],
    resolve: {} 
  },
  { 
    path: 'editor', 
    component: EditorRedirectionComponent
  },
  { 
    path: 'editor/:id', 
    component: EditorComponent
  },
  { 
    path: 'checkout/:type', 
    component: PaymentComponent, 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [ActiveProjectResolver, ProjectsResolver, ActiveDBSourceResolver, AuthResolver, GithubResolver , CheckNewsletterResolver, GoogleResolver]
})

export class AppRoutingModule { }
