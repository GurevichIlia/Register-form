import { Cities } from './../../models/cities.model';
import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FullData } from 'src/app/models/full-data.model';
import { FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-main-info',
  templateUrl: './main-info.component.html',
  styleUrls: ['./main-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainInfoComponent implements OnInit {
  @ViewChild('Birthday', { static: true }) birthDay: ElementRef;
  @Input() mainInfoInputsName: string[];
  @Input() cities: Cities[];
  @Input() fullDataForPage: FullData;
  @Input() registerForm: FormGroup;
  years = _.range(new Date().getFullYear() + 1, 1900);
  monthes = new Array(12);
  days = new Array(31);
  newForm = new FormGroup({

  });


  constructor() { }

  ngOnInit() {
    // this.registerForm.valueChanges.subscribe(e => console.log(this.mainInfo))
    // console.log(this.registerForm.controls.mainInfo['controls']);

  }

  get showCity() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckCity;
    }
  }
  get showRemark() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckRemark;
    }
  }
  get cityRequired() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckCityrequired;
    }
  }
  get birthdayRequired() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckBirthDayrequired;
    }
  }
  get showBirthday() {
    if (this.fullDataForPage) {

      return this.fullDataForPage.LandingWebPages[0].CheckBirthDay;
    }
  }
  get showAfterSunset() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckAfterSunset;
    }
  }
  get mainInfo() {
    return this.registerForm.get('mainInfo') as FormArray;
  }
  get birthday() {
    return this.registerForm.get('birthday');
  }

  get afterSunsetIsShow() {
    if (this.fullDataForPage) {
      return this.fullDataForPage.LandingWebPages[0].CheckAfterSunset;
    }
  }


  setName(inputName: string) {
    let name = '';
    switch (inputName) {
      case 'lastname':
        name = 'lastname';
        break;
      case 'firstname':
        name = 'firstname';
        break;
      case 'email':
        name = 'email';
        break;
      case 'phone' || 'cellphone':
        name = 'phone';
        break;
      case 'address':
        name = 'address';
        break;
      default:
        break;
    }

    return name;
  }
}
