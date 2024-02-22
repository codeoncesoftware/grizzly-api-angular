export class Header {
    name: string;
    description: string;
    type: string;
    format: string;


    constructor(name?: string, desc?: string, type?: string, format?: string) {
        this.name = name;
        this.description = desc;
        this.type = type;
        this.format = null;
    }
}
