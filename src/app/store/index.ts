import { ProjectEffects } from './project/project.effect';
import { ContainerEffects } from './container/container.effects';
import { DBSourceEffects } from './dbsource/dbsource.effect';
import { AuthEffects } from './authentication/auth.effects';
import { DashboardEffects } from './dashboard/dashboard.effect';
import { OrganizationEffects } from './organization/organization.effect';
import { TeamEffects } from './team/team.effect';
import { FunctionEffects } from './function/function.effects';
import { IdentityProviderEffects } from './identityprovider/identityprovider.effect';

export const effects: any[] = [ProjectEffects, ContainerEffects, DBSourceEffects,FunctionEffects ,AuthEffects, DashboardEffects , OrganizationEffects, TeamEffects, IdentityProviderEffects];

