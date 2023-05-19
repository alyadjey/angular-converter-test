import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ExchangeRates {
  [key: string]: number;
}

interface ExchangeData {
  Valute: {
    [key: string]: {
      Value: number;
    };
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  exchangeRates: ExchangeRates = {};
  amount1: number = 1;
  amount2: number = 0;
  currency1: string = 'UAH';
  currency2: string = 'USD';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchExchangeRates();
  }

  fetchExchangeRates() {
    this.http.get<any>('https://www.cbr-xml-daily.ru/daily_json.js').subscribe(data => {
      const rubToUahRate = 1 / data.Valute.UAH.Value; 
      this.exchangeRates = {
        UAH: 1,
        USD: 10 * rubToUahRate * data.Valute.USD.Value,
        EUR: 10 * rubToUahRate * data.Valute.EUR.Value
      };
      this.convertCurrency(2);
    });
  }

  convertCurrency(conversionType: number) {
    if (conversionType === 1) {
      this.amount2 = this.amount1 * (this.exchangeRates[this.currency1] / this.exchangeRates[this.currency2]);
      this.amount2 = +this.amount2.toFixed(2);
    } else {
      this.amount1 = this.amount2 * (this.exchangeRates[this.currency2] / this.exchangeRates[this.currency1]);
      this.amount1 = +this.amount1.toFixed(2);
    }
  }
}