import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
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
import { environment } from 'src/environments/environment';
import { SsoLoginComponent } from './auth/sso-login/sso-login.component';
import { ActiveIdentityProviderResolver } from './shared/resolvers/active-identityprovider.resolver';
import { IdentityProviderResolver } from './shared/resolvers/all-identityproviders';

const routes: Routes = [
  {
    path: '',
    component: SsoLoginComponent,
        resolve: {
            url: 'externalUrlRedirectResolver'
        },
        data: {
            externalUrl: environment.loginUrl
        }
  },
  { path: 'github/login', component: GithubLoginComponent, resolve: { githubResolver: GithubResolver } },
  { path: 'confirm/email/:token', component: LoginComponent, resolve: { authResolver: AuthResolver } },
  { path: 'checknewsletter/:userEmail', component: LoginComponent, resolve: { newsletterResolver: CheckNewsletterResolver } },
  { path: 'checknewsletter/:userEmail/editor', component: EditorComponent, resolve: { newsletterResolver: CheckNewsletterResolver } },
  { path: 'app', component: MainLayoutComponent, resolve: { projectsList: ProjectsResolver, dbsourcesList: DBSourcesResolver, identityproviderList: IdentityProviderResolver } },
  { path: 'project', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule), resolve: { active: ActiveProjectResolver } },
  { path: 'dbsource', loadChildren: () => import('./dbsource/dbsource.module').then(m => m.DBSourceModule), resolve: { active: ActiveDBSourceResolver } },
  { path: 'identityprovider', loadChildren: () => import('./identity-provider/identityprovider.module').then(m => m.IdentityProviderModule), resolve: { active: ActiveIdentityProviderResolver } },
  { path: 'organization', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule), resolve: {} },
  { path: 'editor', component: EditorRedirectionComponent},
  { path: 'editor/:id' , component: EditorComponent},
  { path: 'sso/login', component: SsoLoginComponent },

  {path : 'checkout/:type' , component : PaymentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [{
    provide: 'externalUrlRedirectResolver',
    useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      window.location.href = (route.data as any).externalUrl;
    }
  },ActiveProjectResolver, ProjectsResolver, ActiveDBSourceResolver, AuthResolver, GithubResolver , CheckNewsletterResolver, ActiveIdentityProviderResolver]
})

export class AppRoutingModule { }
