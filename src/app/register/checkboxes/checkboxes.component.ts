import { LandingWebPagesFileds } from './../../models/full-data.model';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxesComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  _checkboxesArray: LandingWebPagesFileds[] = [];

  @Input() registerForm: FormGroup;
  @Input() set checkboxesArray(checkboxesArray: LandingWebPagesFileds[]) {
    if (checkboxesArray) {
      this._checkboxesArray = checkboxesArray;
    }
  }
  constructor() { }

  ngOnInit() {
  }
  get checkboxes() {
    return this.registerForm.get('checkboxes') as FormArray;
  }
  get checkboxArray() {
    return this._checkboxesArray;
  }
}
