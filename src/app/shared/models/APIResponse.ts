
import { Headers } from './Headers';
import { Schema } from './Schema';

export class APIResponse {
    code: string;
    description: string;
    schema: Schema;
    headers: Headers;
    exemples: object;



    constructor(code?: string, desc?: string, schema?: Schema, headers?: Headers , exemples?: object) {
        this.code = code;
        this.description = desc;
        this.schema = schema;
        this.headers = headers;
        this.exemples = exemples;
    }
}
