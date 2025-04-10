import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPageComponent } from './addpage/addpage.component';
import { EditPageComponent } from './editpage/editpage.component';
import { TaskChartComponent } from './task-chart/task-chart.component';
import { UrgencyChartComponent } from './urgency-chart/urgency-chart.component';
import { CalculetTableComponent } from './calculet-table/calculet-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserStatsComponent } from './components/user-stats/user-stats.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add', component: AddPageComponent },
  { path: 'edit/:id', component: EditPageComponent },
  {path: 'chart', component: TaskChartComponent},
  {path: 'chart2', component:  UrgencyChartComponent  },
  {path: 'table', component:  CalculetTableComponent },
  {path: 'user', component: UserFormComponent} ,
  {path:'userstats', component: UserStatsComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
