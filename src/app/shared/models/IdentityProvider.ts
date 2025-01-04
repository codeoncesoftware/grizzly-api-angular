import { Keycloak } from './Keycloak';

export class IdentityProvider {
    id : string;
    name : string;
    displayedName : string;
    description: string;
    userEmail: string;
    credentials: Keycloak = new Keycloak();
    creationTime: string;
    lastUpdate: string;
    organizationId: string;
    teamIds: string[];
    active = true;
    connectionSucceeded : boolean;
}