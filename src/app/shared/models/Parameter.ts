export class Parameter {
    name: string;
    type = 'string';
    value: string;
    in = 'Body';
    modelName = '';
    description: string;
    required: boolean;
    enums: string[];

    constructor(inn?: string, name?: string, type?: string, value?: string , modelName?: string , description?: string , required?: boolean , enums?: string[]) {
        this.in = inn;
        this.name = name;
        this.type = type;
        this.value = value;
        this.modelName = modelName;
        this.description = description;
        this.required = required;
        this.enums = enums;
    }
}
