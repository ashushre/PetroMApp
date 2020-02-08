import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
/**
 * Generated class for the DatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateFormat',
})
export class DateTime extends DatePipe implements PipeTransform{
  /**
   * Takes a value and makes it lowercase.
   */
  static readonly DATE_FMT = 'dd-MM-yy';
  static readonly DATE_TIME_FMT = `${DateTime.DATE_FMT} hh:mm:a`;
  transform(value: string,time) {
    if(time==undefined)
    {
      return super.transform(value, DateTime.DATE_FMT);
    }
    else
    {
      return super.transform(value, DateTime.DATE_TIME_FMT);
    }

  }
}
