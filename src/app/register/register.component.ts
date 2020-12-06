import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { AdditionalFields } from '../models/additional-fields';
import { MainInfo } from '../models/mainInfo.model';
import { SuccessComponent } from '../shared/modals/success/success.component';
import { GeneralService } from './../general.service';
import { Cities } from './../models/cities.model';
import { FinalDataFromRegisterForm } from './../models/data-from-register-form.model';
import { FullData, LandingWebPagesFileds } from './../models/full-data.model';
import { MainInfoComponent } from './main-info/main-info.component';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild(MainInfoComponent, { static: true }) mainInfoComponent: MainInfoComponent;
  registerForm: FormGroup;
  language$: Observable<string>;
  checkboxInputsName: LandingWebPagesFileds[];
  mainInfoInputsName: any[];
  fullDataForPage: FullData;
  filteredByTypeOptions: LandingWebPagesFileds[];
  optionsArray: LandingWebPagesFileds[][]; // Filtered by type 1
  checkboxesArray: LandingWebPagesFileds[];
  subscription$ = new Subject();
  htmlPage: any;
  cities: Cities[];
  filteredCities$: Observable<Cities[]>;
  modal$: MatDialogRef<SuccessComponent>;
  pathGuid;
  additionalFieldsName: AdditionalFields;
  checkAndCheckRequired$: Observable<FormGroup>;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private generalService: GeneralService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private matDialog: MatDialog,

  ) {
    this.getPageGuid();
  }

  ngOnInit() {
    this.generalService.switchLanguage('he');
    this.getCurrentLanguage();
    this.createRegistrationForm();
    this.getCitiesFromServer();
    this.getFullDataFromServer();




    // this.checkAndCheckRequired$ = this.generalService.getFullData(this.pathGuid)
    //   .pipe(
    //     filter(data => data !== null && data !== undefined),
    //     pluck('LandingWebPages', 0),
    //     map(webPages => this.registerService.createChecksAndChecksRequiredArray(webPages)),
    //     tap(res => console.log('FORM CONTROLS', res))
    //   );

    // this.options.valueChanges.subscribe(data => console.log(data));
    // this.checkboxes.valueChanges.subscribe(data => console.log(data));
    // this.registerForm.valueChanges
    //   .pipe(
    //     takeUntil(this.subscription$))
    //   .subscribe(data => console.log(data));

  }
  createRegistrationForm() {
    this.registerForm = this.fb.group({
      mainInfo: this.fb.array([]),
      remark: [''],
      birthday: this.fb.group({
        year: [''],
        month: [''],
        day: ['']
      }),
      afterSunset: [false],
      checkboxes: this.fb.array([]),
      options: this.fb.array([]),
      checks: this.fb.array([]),
      // checksRequired: this.fb.array([]),
      // city: ['']
    });
  }
  get checkboxes() {
    return this.registerForm.get('checkboxes') as FormArray;
  }
  get maininfoInputs() {
    return this.registerForm.get('mainInfo') as FormArray;
  }
  get options() {
    return this.registerForm.get('options') as FormArray;
  }
  get getRegisterForm() {
    return this.registerForm;
  }
  get birthday() {
    return this.registerForm.get('birthday');
  }
  get remark() {
    return this.registerForm.get('remark');
  }
  get city() {
    const cityControl = this.maininfoInputs.controls.find((control: FormGroup) => {
      return Boolean(control.controls['City'])
    }) as FormGroup;

    if (cityControl) {
      return cityControl.controls['City'];
    }
  }
  get afterSunset() {
    return this.registerForm.get('afterSunset');
  }

  getSuccessRedirectLink() {
    const link = this.fullDataForPage.LandingWebPages[0].SuccessRedirectUrl;
    if (link) {
      return link;
    }
  }

  getThanksMessage() {
    const message = this.fullDataForPage.LandingWebPages[0].ThanksMsg;
    if (message) {
      return message;
    }
  }

  addInputsToMainInfoArray() {
    this.registerService.addInputsToInputsArray(this.registerService.getAllmainInfoInputsName(), this.maininfoInputs);
    this.getMainInfoInputsName();

    // console.log('MAIN INFO INPUTS', this.maininfoInputs)
  }

  addInputsToCheckBoxArray() {
    this.getCheckboxInputsName();
    this.registerService.addInputsToInputsArray(this.checkboxInputsName, this.checkboxes);
  }

  getDataFromRegisterForm() {
    if (this.registerForm.invalid) {
      return;
    }
    const mainInfo: MainInfo = this.getDataFromMainInfoForm(this.maininfoInputs.value);
    // const birthdate = this.birthday.value ? moment(this.birthday.value, 'MM/DD/YYYY').format('DD-MM-YYYY') : '';
    const birthdate = this.getBirthdayDate();
    const remark = this.remark.value;
    const groups = this.concatOptionsAndCheckboxes([...this.checkboxes.value], [...this.options.value]);

    this.registerService.setDataFromRegisterForm(
      mainInfo.tz,
      mainInfo.firstname,
      mainInfo.lastname,
      this.afterSunset.value,
      mainInfo.street,
      mainInfo.street2,
      mainInfo.City,
      mainInfo.state, mainInfo.country,
      mainInfo.zip, mainInfo.cellphone, mainInfo.phone, birthdate, remark, mainInfo.email, groups,

    );

    this.registerService.getAdditionalFieldsFromForm(this.registerForm.get('checks').value, this.registerService.getFinalCustomerData());

    this.saveCustomerData(this.registerService.getFinalCustomerData());
    // console.log('REGISTER FORM VALUE', this.registerForm.value);
  }

  getCurrentLanguage() {
    ;
    this.language$ = this.generalService.getLanguage$();
  }

  changeLanguage(language: string) {
    this.generalService.switchLanguage(language);
  }

  getCheckboxInputsName() {
    this.checkboxInputsName = this.setCheckboxInputsValue(this.fullDataForPage.LandingWebPagesFileds);

  }

  getMainInfoInputsName() {
    this.mainInfoInputsName = this.registerService.getMainInfoInputsName();
  }

  getFullDataFromServer() {
    return this.generalService.getFullData(this.pathGuid)
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: FullData) => {
        if (data) {
          // console.log(data, 'Full DATA');
          if (data.LandingWebPages.length !== 0) {
            this.fullDataForPage = data;
            this.registerService.setFullData(data);
            this.setLanguageForPage(data.LandingWebPages[0].lang);
            this.getFilteredCheckBoxesArray(this.fullDataForPage.LandingWebPagesFileds);
            this.createNestedArrayWithOptionsArrays(this.getFilteredOptionsArray(this.fullDataForPage.LandingWebPagesFileds), this.options);
            this.addInputsToMainInfoArray();
            this.addInputsToCheckBoxArray();
            this.getHtmlPage();
            this.setBirthdayIsRequired(data);

            const additionalFieldsControls = this.registerForm.get('checks') as FormArray;

            this.registerService.createChecksAndChecksRequiredArray(data.LandingWebPages[0], additionalFieldsControls);
            this.generalService.setPageTitle(data.LandingWebPages[0].PageTitle);
            // this.registerForm.get('checksRequired')['controls'] = checks.checksRequired;
            this.additionalFieldsName = data.AditionalFileds[0];

            // this.registerForm.get('checksRequired').patchValue(checks.checksRequired)

          } else {
            console.log('Empty Full Data', data);
          }
        } else {
          console.log('No Data', data);
        }
      });
  }

  setBirthdayIsRequired(data: FullData) {
    if (data) {
      if (data.LandingWebPages[0].CheckBirthDayrequired === 1) {
        this.birthday.get('day').setValidators(Validators.required);
        this.birthday.get('month').setValidators(Validators.required);
        this.birthday.get('year').setValidators(Validators.required);
      }
    }
  }


  getBirthdayDate() {
    let day = this.birthday.get('day').value;
    let month = this.birthday.get('month').value;
    let year = this.birthday.get('year').value;
    if (day && month && year) {
      day = day < 10 ? `0${this.birthday.get('day').value}` : this.birthday.get('day').value;
      month = month < 10 ? `0${this.birthday.get('month').value}` : this.birthday.get('month').value;
      year = year;
      const birthday = `${day}/${month}/${year}`;
      // console.log(birthday);
      return birthday;
    }

  }

  // birthdayValidate(date: string) {
  //   const newDate = date.split('.');
  //   // tslint:disable-next-line: max-line-length
  //   if (newDate[0] <= '31' && newDate[0] >= '01' && newDate[1] <= '12' && newDate[1] >= '01' && newDate[2] <= moment().format('YYYY') && newDate[2] >= '1900') {
  //     return true;

  //   } else {
  //     return false;
  //   }
  // }

  setLanguageForPage(language: number) {
    if (language) {
      let lang: string;
      if (language === 0) {
        lang = 'he';
      } else if (language === 1) {
        lang = 'en';
      }
      this.generalService.switchLanguage(lang);
    }

  }

  setCheckboxInputsValue(array: LandingWebPagesFileds[]) {
    return this.registerService.setCheckboxInputsValue(array);
  }

  createNestedArrayWithOptionsArrays(filteredOptions: LandingWebPagesFileds[], options: FormArray) {
    this.optionsArray = this.registerService.createNestedArrayWithOptionsArrays(filteredOptions, options);
    // const arrayForNestedArrays: LandingWebPagesFileds[][] = [];
    // for (const field of filteredOptions) {
    //   const nestedArray = filteredOptions.filter(data => data.groupnofields === field.groupnofields);
    //   if (arrayForNestedArrays.length === 0) {
    //     this.addOptionControl();
    //     arrayForNestedArrays.push(nestedArray);
    //   } else {
    //     if (this.registerService.checkIfArrayAlreadyExist(arrayForNestedArrays, nestedArray)) {
    //       this.addOptionControl();
    //       arrayForNestedArrays.push(nestedArray);
    //     }
    //   }
    // }
    // console.log(arrayForNestedArrays);
    // return arrayForNestedArrays;
  }

  getFilteredCheckBoxesArray(fullData: LandingWebPagesFileds[]) {
    return this.checkboxesArray = fullData
      .filter(field => field.Type === '2').sort((a, b) => {
        return (a.sort > b.sort) ? 1 : (a.sort < b.sort) ? -1 : 0;
      });
  }

  getFilteredOptionsArray(fullData: LandingWebPagesFileds[]) {
    return this.filteredByTypeOptions = fullData
      .filter(field => field.Type === '1').sort((a, b) => {
        return (a.sort > b.sort) ? 1 : (a.sort < b.sort) ? -1 : 0;
      });
  }

  addOptionControl() {
    this.options.push(this.fb.control('', Validators.required));
  }

  changeBirthdayFormat(birthday: string) {
    let changedBirthday;
    if (birthday) {
      changedBirthday = this.registerService.changeDateFormat(birthday, 'DD/MM/YYYY');
    } else {
      changedBirthday = '';
    }
    return changedBirthday;
  }

  getDataFromMainInfoForm(inputsArray: any[]): MainInfo {
    return this.registerService.getDataFromInputs(inputsArray);
  }

  concatOptionsAndCheckboxes(checkBoxesArray: { checkbox: boolean, groupId: number }[], optionsArray: number[]) {
    return this.registerService.concatOptionsAndCheckboxes(checkBoxesArray, optionsArray);
  }

  saveCustomerData(customerData: FinalDataFromRegisterForm) {

    // console.log('FINAL DATA STRING', customerData);
    this.generalService.saveCustomerInfo(customerData, this.getOrgName(), this.getGuid())
      .pipe(
        takeUntil(this.subscription$))
      .subscribe((data: { customerid: string, error: string, moreinfo: string }) => {
        if (data) {
          // tslint:disable-next-line: no-string-literal
          if (data.error === 'false') {
            // tslint:disable-next-line: max-line-length
            const modal = this.matDialog.open(SuccessComponent, { width: '400px', height: '200px', disableClose: true, data: { thanksMessage: this.getThanksMessage() } });
            this.redirectToUrl(modal);
            setTimeout(() => {
              this.resetMainInfoForm();
            }, 1)

            this.toastr.success('נשמר בהצלחה');
            // console.log(data);
          } else {
            // console.log(data);
            this.toastr.warning('Something went wrong!', data.moreinfo);
          }
        }

      }, error => {
        this.toastr.warning('Something went wrong!', error);
        console.log(error);
      });
  }

  getOrgName() {
    return this.fullDataForPage.LandingWebPages[0].OrgGuid;
  }

  getGuid() {
    return this.fullDataForPage.LandingWebPages[0].GUID;
  }

  unsubscribe() {
    this.subscription$.next();
    this.subscription$.complete();
  }

  getHtmlPage() {
    this.generalService.getHtmlPage(this.getGuid())
      .pipe(
        // tap(html => console.log(html)),
        takeUntil(this.subscription$))
      .subscribe(data => this.htmlPage = data);
  }

  getCitiesFromServer() {
    this.generalService.getCitiesFromServer()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(cities => {
        this.filterCity(cities);
      });
  }

  resetMainInfoForm() {
    this.registerForm.get('mainInfo').reset();
    this.birthday.reset();
    this.checkboxes.controls.forEach((data: FormGroup) => data.patchValue({ checkbox: false }));
    this.options.controls.forEach((data: FormControl) => data.patchValue(''));
    // console.log(this.registerForm);
  }

  redirectToUrl(modal: MatDialogRef<SuccessComponent>) {
    modal.afterClosed()
      .pipe(
        takeUntil(this.subscription$))
      .subscribe(() => {
        const link = this.getSuccessRedirectLink();
        if (link) {
          window.location.assign(link);
        } else {
          window.location.assign(window.location.href);
        }
      });
  }

  getPageGuid() {
    const path = window.location.pathname.split('/');
    this.pathGuid = path[path.length - 1];
    // console.log('FULL PATH', path);
    // console.log('PATH ARRAY', this.pathGuid);
  }

  cityAutocomplete(filteredSubject: Cities[], titleInput: AbstractControl, filterKey: string) {
    return this.registerService.formControlAutoComplete(filteredSubject, titleInput, filterKey);
  }

  filterCity(filteredSubject: Cities[]) {
    if (!this.city) return
    this.filteredCities$ = this.cityAutocomplete(filteredSubject, this.city, 'CityName');
  }




  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.unsubscribe();
  }
}

