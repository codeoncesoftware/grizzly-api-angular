import { Contact } from './Contact';
import { License } from './License';
import { ResourceGroup } from './ResourceGroup';
import { Server } from './Server';

// DTO Container
export class Container {
    id: string;
    projectId: string;
    name: string;
    description: string;
    creationTime: string;
    lastUpdate: string;
    resourceGroups: ResourceGroup[] = [];
    hierarchy = '';
    enabled: boolean;
    swaggerUuid: string;
    endpointModels: any[];
    termsOfService: string;
    contact: Contact = new Contact();
    license: License = new License();
    firstCreation: boolean;
    exportPreference: string;
    servers: Server[];
    hasFunctions: boolean;
}
