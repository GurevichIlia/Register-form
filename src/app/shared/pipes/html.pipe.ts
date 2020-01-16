import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'htmlPipe',
  pure: true
})
export class HtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(content: string): any {
    if (content) {
      content = content.split('``').join('');
      const newcontent = this.sanitizer.bypassSecurityTrustHtml(content);
      return newcontent;
    }
  }
}
