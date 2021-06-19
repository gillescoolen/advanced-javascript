import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {

  // tslint:disable-next-line:ban-types
  transform(data: Object): string[] {
    return Object.values(data);
  }

}
