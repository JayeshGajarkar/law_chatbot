import { Injectable } from '@angular/core';
import { User } from '../models/model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  private user:User | null=null;
  // private isLoggedIn = new Subject<boolean>();
  private Users: User[] = [{name:'jayesh',email:'jayeshgajarkar@gmail.com',password:'J@yesh1711'}];

  userLoign =new BehaviorSubject<User | null>(null);

  logIn(user: User) {
    if(this.Users.find(u => u.email === user.email && u.password === user.password)) {
      this.user = user;
      this.userLoign.next(this.user);
      alert('Logged In Successfully');
    }else{
      alert('Invalid Credentials');
    }
    this.router.navigate(['/dashboard']);
  }

  logOut() {
    this.user = null;
    this.userLoign.next(this.user);
    this.router.navigate(['/login']);
  }

  signIn(user: User) {
    this.Users.push(user);
    this.logIn(user);
    // alert('Signed In Successfully');
  }

  isLoggedIn() {
    return this.user !== null;
  }


}
