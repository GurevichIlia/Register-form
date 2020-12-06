import { AdditionalFields } from './../../models/additional-fields';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-additional-fields',
  templateUrl: './additional-fields.component.html',
  styleUrls: ['./additional-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalFieldsComponent implements OnInit {
  length = _.range(1, 20);
  checks: FormArray;
  checksForm: FormGroup;

  @Input() set additionalFields(fields: FormGroup) {
    if (fields) {
      this.checksForm = fields;
    }

    this.checks = this.checksForm.controls.checks['controls'];
    // console.log('CHECKS', this.checks);
  }
  @Input() additionalFieldsName: AdditionalFields;
  constructor() { }

  ngOnInit() {
  }

  getKey(object) {
    const key = Object.keys(object)[0];

    return key;
  }

  getControlName(control: FormGroup) {

    return this.getKey(control.value);
  }

  getLabel(control: FormGroup) {

    const name = this.additionalFieldsName[this.getKey(control.value)];

    return name;
  }

  isRequired(control: FormGroup) {
    const internalControl = control.controls[this.getKey(control.value)];

    if (internalControl) return internalControl.errors;

  }
  // showInfo() {
  //   console.log('CHECK FORM FILEDS', this.checksForm.value);
  // }
}
