import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the QuantiyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'Mquantity',
})
export class MQuantiyPipe implements PipeTransform {
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
    var result = value.toString().split('.');
    var lastThree = result[0].substring(result[0].length - last);
    var otherNumbers = result[0].substring(0, result[0].length - last);
    if (otherNumbers != '' && otherNumbers != '-')
        lastThree = ',' + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    if (result.length > 1) {
        output += "." + result[1];
    }

    return output;

}
    }