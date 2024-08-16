import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ExamplePageComponent } from './components/example-page/example-page.component';


const routes: Routes = [
  {
    path:'', component:AdminDashboardComponent, children:[
      {path:'home', component:HomeComponent},
      {path:'about', component:AboutComponent},
      {path:'example', component:ExamplePageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
