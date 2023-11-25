import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        ButtonModule,
        SelectButtonModule,
        TableModule,
        PaginatorModule,
        CalendarModule,
        HttpClientModule,
        ToastModule,
      ],
      providers: [MessageService],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
  it('should have a default theme of "saga-blue"', () => {
    expect(component.selectedTheme).toBe('saga-blue');
  });

  it('should load data on ngOnInit', () => {
    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(component.loadData).toHaveBeenCalled();
  });
});
