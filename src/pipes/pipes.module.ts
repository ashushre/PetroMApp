import { NgModule } from '@angular/core';
import { MQuantiyPipe } from './quantiy/quantiy';
import { McurrencyPipe } from './mcurrency/mcurrency';
import { DateTime } from './date/date';
import { DateTimePipe } from './date-time/date-time';
import { INquantityPipe } from './i-nquantity/i-nquantity';
import { InCurrencyPipe } from './in-currency/in-currency';
@NgModule({
	declarations: [
	MQuantiyPipe,
	DateTime,
	DateTimePipe,
	INquantityPipe,
	InCurrencyPipe,
    McurrencyPipe],
	imports: [],
	exports: [MQuantiyPipe,
	DateTime,
		DateTimePipe,
		INquantityPipe,
		InCurrencyPipe,
    McurrencyPipe]
})
export class PipesModule {}
