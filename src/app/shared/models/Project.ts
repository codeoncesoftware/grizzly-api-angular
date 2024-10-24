import { Security } from './Security';

// DTO Project
export class Project {
    id: string;
    name: string;
    creationTime: string;
    lastUpdate: string;
    description: string;
    userEmail: string;
    dbsourceId: string;
    dbOutKafkaId: string;
    dbOutMongoId: string;
    identityProviderIds: string[];
    databaseName: string;
    securityConfig: Security = new Security();
    roles: string[];
    type: string;
    organizationId: string;
    teamIds: string[];
    gitUsername: string;
    gitPassword: string;
    gitUrl: string;
    gitBranch: string;
    gitToken: string;
    securityEnabled: boolean;
    analyticMicroservice: boolean;
    dbOutKafka: boolean;
    dbOutMongo: boolean;
    userManagementEnabled: boolean;
    runtimeUrl: string;
    authMSRuntimeURL: string;
    authorizedApps: Security[];
    iamDelegatedSecurity: string;
    kafka_topic: string;
    kafka_group_id: string;
    kafka_host: string;
    mongodbURI: string;

}
