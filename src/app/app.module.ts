import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EditPageComponent } from './editpage/editpage.component';
import { AddPageComponent } from './addpage/addpage.component';
import { TaskChartComponent } from './task-chart/task-chart.component'; 
import { UrgencyChartComponent } from './urgency-chart/urgency-chart.component';
import { CalculetTableComponent } from './calculet-table/calculet-table.component';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';
import { ProgressBarModule } from 'primeng/progressbar';
// other imports
import { ChartsModule } from 'ng2-charts';
import { ProducerStatsComponent } from './producer-stats/producer-stats.component';
import { MonthlySnapshotComponent } from './monthly-snapshot/monthly-snapshot.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddPageComponent,
    EditPageComponent,
    TaskChartComponent,
    UrgencyChartComponent,
    CalculetTableComponent,
    UserFormComponent,
    UserStatsComponent,
    ProducerStatsComponent,
    MonthlySnapshotComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    DropdownModule,
    CalendarModule,
    ProgressBarModule,
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
