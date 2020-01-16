import { Cities } from './../models/cities.model';
import { LandingWebPagesFileds, FullData, LandingWebPages } from './../models/full-data.model';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { FinalDataFromRegisterForm } from '../models/data-from-register-form.model';
import * as moment from 'moment';
import { MainInfo } from '../models/mainInfo.model';
import { startWith, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  customerInfo = {};
  checkboxInputsName: LandingWebPagesFileds[];
  mainInfoInputsName: string[] = [];
  allMainInfoInputsName = ['Checkfirstname', 'Checklastname', 'Checkemail', 'Checkstreet', 'Checkstreet2', 'Checkzip', 'Checkstate', 'Checkcountry', 'Checktz', 'Checkcellphone', 'Checkphone'];
  fullDataForPage: FullData;
  finalDataFromRegisterForm: FinalDataFromRegisterForm;
  constructor(
    private fb: FormBuilder
  ) { }

  addInput(inputName: LandingWebPagesFileds | string, inputArray: FormArray) {
    if (typeof (inputName) === 'string') {
      if (this.checkIfNeedShowField(this.fullDataForPage.LandingWebPages, inputName)) {
        inputArray.push(this.fb.group({
          [inputName.substr(5)]: ['', this.addValidator(inputName, this.fullDataForPage.LandingWebPages)]
        }));
      }
    } else {
      inputArray.push(this.fb.group({
        checkbox: [''],
        groupId: inputName.Groupid
      }));
    }
    // console.log('INPUTS ARRAY', inputArray);
  }
  addInputsToInputsArray(arrayWithNameForInput: LandingWebPagesFileds[] | string[], inputsArray: FormArray) {
    if (arrayWithNameForInput) {
      arrayWithNameForInput.forEach((inputName: string | LandingWebPagesFileds) => {
        this.addInput(inputName, inputsArray);
      });
    }
  }
  getCheckboxInputsName() {
    return this.checkboxInputsName;
  }

  getMainInfoInputsName() {
    return this.mainInfoInputsName;
  }

  getAllmainInfoInputsName() {
    return this.allMainInfoInputsName;
  }

  addValidator(inputName: string, arrayWithFields: LandingWebPages[]) {
    const requiredField = arrayWithFields[0][`${inputName}required`];
    if (requiredField === 1) {
      if (inputName === 'Checkemail') {
        return [Validators.required, Validators.email];
      } else {
        return Validators.required;
      }

    } else if (inputName === 'Checkfirstname' || inputName === 'Checklastname') {
      return Validators.required;
    }
    //  else if (inputName === 'Checkemail') {
    //   return [Validators.required, Validators.email];
    // }
  }
  setCheckboxInputsValue(array: LandingWebPagesFileds[]) {
    return this.checkboxInputsName = array.filter(field => field.Type === 2);
  }

  checkIfNeedShowField(arrayWithDataForChecking: LandingWebPages[], inputName: string) {
    const showFieled = arrayWithDataForChecking[0][inputName];
    if (showFieled === 1) {
      this.mainInfoInputsName.push(inputName.substr(5));
      return true;
    } else if (showFieled === 0) {
      if (inputName === 'Checkemail') {
        this.mainInfoInputsName.push(inputName.substr(5));
        return true;
      } else {
        return false;
      }


    }
  }
  clearMainInfoInputsName() {
    this.mainInfoInputsName = [];
  }

  setFullData(data: FullData) {
    this.clearMainInfoInputsName();
    this.fullDataForPage = data;
  }

  setDataFromRegisterForm(tz: string, firstname: string, lastname: string,
    afterSunset: boolean,
    street: string,
    street2: string,
    city: string,
    state: string,
    country: string,
    zip: string,
    cellphone: string,
    phone: string,
    birthdate: string,
    remark: string,
    email: string,
    groups: { groupId: number }[]) {
    this.finalDataFromRegisterForm = {
      tz,
      firstname,
      lastname,
      afterSunset,
      street,
      street2,
      city,
      state,
      country,
      zip,
      cellphone,
      phone,
      birthdate,
      remark,
      groups,
      email,

    };

  }
  checkIfArrayAlreadyExist(arrayForChecking: LandingWebPagesFileds[][], newArray: LandingWebPagesFileds[]) {
    let exist: boolean;
    for (const field of arrayForChecking) {
      if (field[0].groupnofields === newArray[0].groupnofields) {
        exist = true;
        break;
      } else {
        exist = false;
      }
    }
    if (exist) {
      return false;
    } else {
      return true;
    }
  }

  changeDateFormat(date: string, format: string) {
    return moment(date, 'DD/MM/YYYY').format(format);
  }

  getDataFromInputs(inputsArray: any[]): MainInfo {
    const customerInfo: MainInfo = {} as MainInfo;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < inputsArray.length; i++) {
      const key = Object.keys(inputsArray[i]).toString();
      customerInfo[key] = inputsArray[i][key];
    }
    return customerInfo;
  }

  concatOptionsAndCheckboxes(checkBoxesArray: { checkbox: boolean, groupId: number }[], optionsArray: number[]) {
    const concatedArrays = checkBoxesArray.filter(checkbox => checkbox.checkbox === true).map(data => {
      return { groupId: data.groupId };
    }).concat(...optionsArray.map(data => {
      return { groupId: data };
    }));
    return concatedArrays;
  }

  getFinalCustomerData() {
    return this.finalDataFromRegisterForm;
  }

  createNestedArrayWithOptionsArrays(filteredOptions: LandingWebPagesFileds[], options: FormArray) {
    const arrayForNestedArrays: LandingWebPagesFileds[][] = [];
    for (const field of filteredOptions) {
      const nestedArray = filteredOptions.filter(data => data.groupnofields === field.groupnofields);
      if (arrayForNestedArrays.length === 0) {
        this.addOptionControl(options);
        arrayForNestedArrays.push(nestedArray);
      } else {
        if (this.checkIfArrayAlreadyExist(arrayForNestedArrays, nestedArray)) {
          this.addOptionControl(options);
          arrayForNestedArrays.push(nestedArray);
        }
      }
    }
    // console.log('NESTED ARRAYS', arrayForNestedArrays);
    return arrayForNestedArrays;
  }

  addOptionControl(options: FormArray) {
    options.push(this.fb.control('', Validators.required));
  }

  formControlAutoComplete(filteredSubject: any[], titleInput: AbstractControl, filterKey: string) {
    if (filteredSubject) {
      let filteredOptions$;
      return filteredOptions$ = titleInput.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filter(value, filteredSubject, filterKey))
        );
    }
  }
  private filter(value: string, filteredSubject: any[], filterKey: string): Cities[] {
    if (value == null) {
      value = '';
    }
    const filterValue = value.toLowerCase();

    return filteredSubject.filter((title: Cities) => title[filterKey].toLowerCase().includes(filterValue));
  }

  
}
