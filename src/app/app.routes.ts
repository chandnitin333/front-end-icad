import { Routes } from '@angular/router';
import { CourseSubjectAllocationComponent } from './components/froms/course-subject-allocation/course-subject-allocation.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
{
  path:'login', component:LoginComponent,
},
{
  path:'forgot-password', component:ForgotPasswordComponent,
},
{
path: '', redirectTo:"/login",pathMatch:'full'
},
{path:'admin',
   loadChildren: ()=> import('./modules/admin/admin.module').then((m)=>m.AdminModule)},
{
  path:'**', component:NotFoundComponent,
}

];
