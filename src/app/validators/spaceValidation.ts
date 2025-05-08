import { AbstractControl, ValidationErrors } from "@angular/forms";
 
export class SpaceValidator{
    
    static validator(controlName : AbstractControl):ValidationErrors | null{
        if(controlName.value != null && controlName.value.split(' ').length >1 ){
            return {noSpaceAllowed:true}
        }
        return null;
    }
         
}