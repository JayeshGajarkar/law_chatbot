import { AbstractControl, ValidationErrors } from '@angular/forms';

export class multiSpacesValidator {
    static validator(control: AbstractControl): ValidationErrors | null {
        const value = (control.value || '').replace(/\s+/g, '');
        const isValid = value.length > 5;
        return isValid ? null : {multiSpace: true };
    }
}