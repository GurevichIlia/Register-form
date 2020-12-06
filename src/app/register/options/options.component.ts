import { LandingWebPagesFileds } from './../../models/full-data.model';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsComponent implements OnInit {
  // tslint:disable-next-line: variable-name
  @Input() _optionsArray: LandingWebPagesFileds[][];
  @Input() registerForm: FormGroup;

  @Input() set optionsArray(optionsArray: LandingWebPagesFileds[][]) {
    this._optionsArray = optionsArray;
    // console.log(this.registerForm)
  }
  constructor() { }

  ngOnInit() {
  }

}
