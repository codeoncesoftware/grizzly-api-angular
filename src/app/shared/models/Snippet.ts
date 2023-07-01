class Param {
    in: string;
    name: string;
    type: string;
    value: string;

    constructor(inn: string, name: string, type: string, value?: string) {
        this.in = inn;
        this.name = name;
        this.type = type;
        this.value = value;
    }
}
export class Snippet {
    query: string;
    params: Param[];

    constructor(query: string, params: Param[]) {
        this.query = query;
        this.params = params;
    }
}
