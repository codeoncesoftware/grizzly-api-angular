export class Column {
    name: string;
    type: string;
    category: string;
    primary=false;
    indexed=false;
    unique = false;
    nullable = false;
    autoIncrement = false;
    editModeEnabled = false;
}
