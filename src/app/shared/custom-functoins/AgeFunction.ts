import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minimumAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthdate = new Date(control.value);
    const today = new Date();

    if (isNaN(birthdate.getTime())) {
      return null; // Let the required validator handle empty values
    }

    const age = today.getFullYear() - birthdate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() >= birthdate.getDate());

    const actualAge = hasHadBirthdayThisYear ? age : age - 1;

    return actualAge < minAge
      ? { minAge: { requiredAge: minAge, actualAge } }
      : null;
  };
}
