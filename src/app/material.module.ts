import { NgModule } from '@angular/core';

import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatRadioModule,
  MatSelectModule,


} from '@angular/material';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatRadioModule,
  MatSelectModule,
 

];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule {}
