import { FinalDataFromRegisterForm } from './models/data-from-register-form.model';
import { FullData } from './models/full-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cities } from './models/cities.model';

interface ResponseAfterSave {
  customerid: string;
  error: string;
  moreinfo: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  language = new BehaviorSubject<string>('he');
  language$ = this.language.asObservable();
  baseUrl = 'https://jaffawebapisandbox.amax.co.il/Api/LandingPage/';
  constructor(
    private translateService: TranslateService,
    private http: HttpClient
  ) {
  }
  switchLanguage(language: string) {
    this.translateService.use(language);
    this.setLanguage(language);
    if (language === 'he') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }
  }
  setLanguage(language: string) {
    this.language.next(language);
  }
  getLanguage$() {
    return this.language$;
  }

  getFullData(guidRef: string): Observable<FullData> {
    return this.http.get(`${this.baseUrl}GetRegisterationPageInfoFromUrl?urlAddr=${guidRef}`)
      .pipe(map((fullData: { Data: FullData, ErrMsg: string, IsError: boolean }) => fullData.Data));
  }

  getCitiesFromServer(): Observable<Cities[]> {
    return this.http.get(`${this.baseUrl}GetCitiesGlobal?urlAddr`)
      .pipe(map((fullData: { Data: string, ErrMsg: string, IsError: boolean }) => JSON.parse(fullData.Data)));
  }

  // tslint:disable-next-line: max-line-length
  saveCustomerInfo(customerInfo: FinalDataFromRegisterForm, orgName: string, pageGuid: string): Observable<ResponseAfterSave> {
    return this.http.post(`${this.baseUrl}SaveRegInfoByID?urlAddr=${orgName}&pageguid=${pageGuid}`, customerInfo)
      .pipe(map((response: { Data: ResponseAfterSave, ErrMsg: string, IsError: boolean }) => response.Data));
  }

  getHtmlPage(guid: string) {
    return this.http.get(`${this.baseUrl}GetHtmlPage_ForReg?urlAddr=${guid}`);
  }

}
