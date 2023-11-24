import { Component, OnInit } from '@angular/core';
import { NbpService } from './nbp.service';

export interface ColumnSort {
  sortDirection: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-web';
  exchangeRates: any[] = [];
  cols: { [key: string]: ColumnSort } = {};
  first: number = 0;
  rows: number = 6;
  totalRecords: number = 0;
  selectedDate: Date | undefined;

  selectedTheme: string = 'light';
  stateOptions: any[] = [
    { label: 'Ciemny', value: 'ciemny' },
    { label: 'Jasny', value: 'jasny' },
  ];

  constructor(private nbp: NbpService) {}

  ngOnInit() {
    this.loadData();
  }

  // Metoda do pobierania danych z paginacją
  loadData() {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);

      this.nbp.getDataByDate(formattedDate).subscribe(
        (data: any) => {
          console.warn(data);
          if (data && data[0] && data[0].rates) {
            this.exchangeRates = data[0].rates;
            this.totalRecords = this.exchangeRates.length;
          }
        },
        (error) => {
          // Obsłuż błędy komunikacji z API
          console.error('Błąd pobierania danych z NBP API:', error);
        }
      );
    } else {
      // Pobierz ogólne dane, jeśli nie wybrano daty
      this.nbp.getData().subscribe((data: any) => {
        console.warn(data);
        if (data && data[0] && data[0].rates) {
          this.exchangeRates = data[0].rates;
          this.totalRecords = this.exchangeRates.length;
        }
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Metoda obsługująca zmianę strony (wywołana przez paginator)
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadData();
  }

  onDateChange() {
    if (this.selectedDate) {
      this.loadData();
    }
  }

  resetDate() {
    this.selectedDate = undefined;
    this.loadData();
  }

  sortColumn(columnName: string) {
    if (this.exchangeRates.length > 0) {
      const columnDirection = this.getColumnSortDirection(columnName);

      this.exchangeRates.sort((a, b) => {
        const valueA = a[columnName];
        const valueB = b[columnName];

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return columnDirection * valueA.localeCompare(valueB);
        } else {
          return columnDirection * (valueA - valueB);
        }
      });
    }
  }

  getColumnSortDirection(columnName: string): number {
    if (!this.cols[columnName]) {
      this.cols[columnName] = { sortDirection: 1 };
    }

    this.cols[columnName].sortDirection =
      this.cols[columnName].sortDirection === 1 ? -1 : 1;
    return this.cols[columnName].sortDirection;
  }
}
