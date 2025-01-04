import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { ProjectsResolver } from '../../shared/resolvers/all-projects.resolver';
import { ActiveProjectResolver } from 'src/app/shared/resolvers/active-project.resolver';
import { DBSourcesResolver } from 'src/app/shared/resolvers/all-datasources';
import { ActiveDBSourceResolver } from 'src/app/shared/resolvers/active-dbsource.resolver';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { SettingsComponent } from '../settings/settings.component';
import { DashboardResolver } from 'src/app/shared/resolvers/dashboard.resolver';
import { BillingComponent } from '../billing/billing.component';
import { IdentityProviderResolver } from 'src/app/shared/resolvers/all-identityproviders';
import { ActiveIdentityProviderResolver } from 'src/app/shared/resolvers/active-identityprovider.resolver';
import { GrizzlyAiComponent } from 'src/app/grizzly-ai/grizzly-ai.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: 'app',
    component: MainLayoutComponent,
    resolve: { projectsList: ProjectsResolver, dbsourcesList: DBSourcesResolver, identityProviderList: IdentityProviderResolver },
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, resolve: { dashboard: DashboardResolver } },
      { path: 'grizzly-ai', component: GrizzlyAiComponent, canActivate: [AuthGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
      { path: 'billing', component: BillingComponent, canActivate: [AuthGuard] },
      { path: 'project', loadChildren: () => import('../../project/project.module').then(m => m.ProjectModule), canActivate: [AuthGuard] },
      { path: 'dbsource', loadChildren: () => import('../../dbsource/dbsource.module').then(m => m.DBSourceModule), canActivate: [AuthGuard] },
      { path: 'identityprovider', loadChildren: () => import('../../identity-provider/identityprovider.module').then(m => m.IdentityProviderModule), canActivate: [AuthGuard] },
      { path: 'organization', loadChildren: () => import('../../organization/organization.module').then(m => m.OrganizationModule), resolve: {}, canActivate: [AuthGuard] },
      { path: '**', component: NotFoundComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
  providers: [ProjectsResolver, ActiveProjectResolver, DBSourcesResolver, ActiveDBSourceResolver, DashboardResolver, IdentityProviderResolver, ActiveIdentityProviderResolver]
})
export class MainLayoutRoutingModule { }
