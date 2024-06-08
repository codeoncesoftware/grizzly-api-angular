import { Column } from './Column';
import { Constraint } from './Constraint';
import { Index } from './Index';

export class Table {
    name: string;
    columns: Column[];
    constraints: Constraint[];
    primaryKeys: string[];
    indexes: Index[];
    selectedIndexes:any[]
}
