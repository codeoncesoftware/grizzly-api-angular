import { UntypedFormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        return control.parent.errors && control.dirty && control.parent.errors['notSame'];
    }
}
