import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the INquantityPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'quantity',
})
export class INquantityPipe implements PipeTransform {
 transform(value,toFix,last,all): string{
if(last==undefined)
{
 last=3;
}
if(all==undefined)
{
 all=2;
}
if(toFix==undefined)
{
 toFix=0;
}

   value=parseFloat(value).toFixed(toFix);
   var output=value;
   return output;

}
}
