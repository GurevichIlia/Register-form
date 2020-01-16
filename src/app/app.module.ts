import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'ngx-moment';
import { MainInfoComponent } from './register/main-info/main-info.component';
import { CheckboxesComponent } from './register/checkboxes/checkboxes.component';
import { OptionsComponent } from './register/options/options.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { HtmlPipe } from './shared/pipes/html.pipe';
import { ToastrModule } from 'ngx-toastr';
import { SuccessComponent } from './shared/modals/success/success.component';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// export const options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    MainInfoComponent,
    CheckboxesComponent,
    OptionsComponent,
    HtmlPipe,
    SuccessComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    HttpClientModule,
    MomentModule,
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),

  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
  entryComponents: [SuccessComponent]
})
export class AppModule { }
