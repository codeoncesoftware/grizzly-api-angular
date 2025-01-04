export class CustomQuery {
    datasource: string;
    database: string;
    collectionName: string;
    queryName: string;
    indexType: string;
    query: string;
    type = 'Insert';
    many = false; // number of response elements (Many or one)
    requestMany = false; // number of request elements (Many or one)
}
