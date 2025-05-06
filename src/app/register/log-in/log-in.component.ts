import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/model';

@Component({
  selector: 'app-log-in',
  standalone: false,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {

  logInForm!: FormGroup;
  currUser:User|null=null;

  constructor(private logInService: AuthService) { }

  ngOnInit() {
    this.logInForm=new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

    this.logInService.userLoign.subscribe(user => {
      this.currUser = user;
    });
  }

  onSubmit(){
    this.logInService.logIn(this.logInForm.value);
  }

  isLoggedIn() {
    return this.currUser !== null;
  }

  logOut() {
    this.logInService.logOut();
  }
}
