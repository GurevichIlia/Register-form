import { catchError, map, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EMPTY, fromEvent } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IframeConnectorService {

  constructor() { }
  /**
   * @param fromTarget 'Window where from we listen an event'
   */
  getMessage(fromTarget: Window) {
    return fromEvent(fromTarget, 'message').pipe(
      filter((event: MessageEvent) => event.origin.startsWith('http://localhost:4200') || event.origin.startsWith('https://campaigns.amax.co.il/')),
      catchError(err => {
        console.log('IFRAME ERROR', err);

        return EMPTY;
      })
    );
  }

  /**
   * @param target 'Iframe where you want to send'
   * @param message 'Data you want to send'
   * @param targetOrigin 'URL from where we send data. Example:http://domain.com/example'
   */
  sendMessage<T>(target: Window | HTMLCollection, message: any) {
    target = target as Window;
    try {
      target.postMessage(message, '*');
    } catch (error) {
        console.log('ERROR')
    }




    // if (target instanceof HTMLCollection) {
    //   let i = 0;
    //   while (target[i]) {
    //     const iframe = target[i] as unknown as Window;

    //     iframe.postMessage(message, targetOrigin);
    //     i++;
    //   }
    // }


  }
}
