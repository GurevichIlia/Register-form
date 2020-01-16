import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {
  // tslint:disable-next-line: variable-name
  private _thanksMessage: string;
  constructor(
    public dialogRef: MatDialogRef<SuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { thanksMessage: string }

  ) {
    this.thanksMessage = data.thanksMessage;
  }
  set thanksMessage(message) {
    if (message) {
      this._thanksMessage = message;
    } else {
      this._thanksMessage = '';
    }

  }
  get thanksMessage() {
    return this._thanksMessage;
  }
  closeModal() {
    this.dialogRef.close();
  }
}
