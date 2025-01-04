//import { Byte } from '@angular/compiler/src/util';
import { Database } from './Database';

export class DBSource {
    id: string;
    name: string;
    description: string;
    host: string;
    port: number;
    uri: string;
    database: string;
    userEmail: string;
    authenticationDatabase: string;
    gridFsDatabase: string;
    username: string;
    password: string;
    creationTime: string;
    lastUpdate: string;
    active = true;
    databases: Database[];
    collectionsList: string[];
    connectionMode: string;
    provider: string;
    connectionSucceeded: boolean;
    organizationId: string;
    teamIds: string[];
    // CouchBaseDB Field
    bucketName: string;
    // ElasticSearch Field
    clusterName: string;
    type: string
    secured: boolean;
    authDBEnabled: boolean;
    // BigQuery Field
    privetkeyBigQuery: Uint8Array[];
// Kafka Field
    topic:String;
 
    constructor() {
        // this.port = 27017;
        this.connectionMode = 'FREE';
        // this.provider = 'MONGO';
        this.authenticationDatabase = 'admin';
    }
}
