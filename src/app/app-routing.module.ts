import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './register/log-in/log-in.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './register/forgot-password/forgot-password.component';
import { SignUpComponent } from './register/sign-up/sign-up.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path:'login', component: LogInComponent},
  {path:'signup', component: SignUpComponent},
  {path:'forgotPassword',component:ForgotPasswordComponent},
  {path: '**', redirectTo: '/home'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
