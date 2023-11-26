import { Component, OnInit } from '@angular/core';
import { NbpService } from './services/nbp.service';
import { ThemeService } from './services/theme-service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

export interface ColumnSort {
  sortDirection: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loading: boolean = false;
  private exchangeRates: any[] = [];
  public first: number = 0;
  public rows: number = 10;
  public totalRecords: number = 0;
  public selectedDate: Date | undefined;
  public selectedTheme: string = 'saga-blue';
  public theme: 'saga-blue' | 'vela-blue' = 'saga-blue';
  public stateOptions: any[] = [
    { label: 'Ciemny', value: 'vela-blue' },
    { label: 'Jasny', value: 'saga-blue' },
  ];

  constructor(
    private nbp: NbpService,
    private themeService: ThemeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  changeTheme(value: any) {
    if (value.value) {
      this.themeService.switchTheme(value.value);
    }
  }

  // Metoda do pobierania danych z paginacją
  loadData() {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);

      this.nbp.getDataByDate(formattedDate).subscribe(
        (data: any) => {
          if (data && data[0] && data[0].rates) {
            this.exchangeRates = data[0].rates;
            this.totalRecords = this.exchangeRates.length;
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Błąd',
            detail: 'Brak danych dla wybranego dnia',
          });
        }
      );
    } else {
      // Pobierz ogólne dane, jeśli nie wybrano daty
      this.nbp.getData().subscribe((data: any) => {
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
      console.log('hh');
    }
  }

  resetDate(table: Table) {
    this.selectedDate = undefined;
    this.loadData();
    this.first = 0;
    table.clear();
  }
}
