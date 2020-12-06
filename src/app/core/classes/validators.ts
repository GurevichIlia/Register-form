import { validateTZ } from '../global-functions/global-functions';
import { FormControl } from '@angular/forms';


export class MyValidators {

  static validateTZ(control: FormControl): { [key: string]: boolean } {
    if (!control.value) return { notValidTZ: true }

    if (control.value.length > 9 || (9 > control.value.length && control.value.length > 0)) {
      return { notValidTZ: true };
    }

    if (control.value.length === 9) {

      const notNumber = control.value.split('').filter(char => isNaN(char));

      if (notNumber.length > 0) {
        return { notValidTZ: true };
      }
    }

    if (!validateTZ(control.value)) {
      return { notValidTZ: true };
    }

    return null;
  }

}
