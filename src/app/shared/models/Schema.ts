export class Schema {
    array = false;
    ref = '';
    constructor(array?: boolean, ref?: string) {
        this.array = array;
        this.ref = ref;
    }
}

