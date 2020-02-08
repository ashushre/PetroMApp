import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
/**
 * Generated class for the DatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateTimeFormat',
})
export class DateTimePipe extends DatePipe implements PipeTransform{
  /**
   * Takes a value and makes it lowercase.
   */
  static readonly DATE_FMT = 'dd-MM-yy';
  static readonly DATE_TIME_FMT = `${DateTimePipe.DATE_FMT}, hh:mm a`;
  transform(value: string,time) {
    if(time==undefined)
    {
      return super.transform(value, DateTimePipe.DATE_FMT);
    }
    else
    {
      return super.transform(value, DateTimePipe.DATE_TIME_FMT);
    }
  }
}
