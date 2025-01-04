// DTO Project
export class DockerExport {
    id: string;
    description: string;
    retention: string;
    lastUpdate: string;
    userEmail: string;
    projectId: string;
    projectName: string;
    containerName: string;
    status: string;
    tag: string;
    repoUrl: string;
    hasFunctions:boolean;
    databaseType:string;
    databasePort:string;
    databaseUsername:string;
    databasePassword:string;
    databaseProvider:string;
    databaseName:string;
    databaseHost:string;
}
