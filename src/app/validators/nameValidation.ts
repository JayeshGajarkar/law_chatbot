import { AbstractControl, ValidationErrors } from "@angular/forms";

export class nameValidator {

    static validator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value) {
            const startsWithSpace = value.startsWith(' ');
            const hasNumber = /\d/.test(value);
            if (startsWithSpace || hasNumber) {
                return {noSpaceAndNumber:true};
            }
        }
        return null;
    }

}