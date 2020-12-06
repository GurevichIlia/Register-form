import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, config: { searchValue: string, replaceValue: string }): any {
    value = value.replace(config.searchValue, config.replaceValue);

    return value;
  }

}
