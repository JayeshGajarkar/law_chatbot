import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, throttleTime } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SpaceValidator } from '../../validators/spaceValidation';
import { User } from '../../models/model';

@Component({
  selector: 'app-log-in',
  standalone: false,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',
})

export class LogInComponent{

  logInForm:FormGroup;
  currUser!: User | null;

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {
    //use throttling to prevent multiple api request
    this.clickSubject.pipe(throttleTime(5000)).subscribe(() => {
      this.logInClick();
    })

    this.logInForm= new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, SpaceValidator.validator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), SpaceValidator.validator])
    });
  }

  private clickSubject = new Subject<void>();

  ngOnInit(): void {
    this.authService.currUserSubject$.subscribe(data => {
      this.currUser = data;
    })
  }

  onSubmit() {
    this.clickSubject.next();
    // this.logInClick();
  }

  private logInClick() {
    this.authService.logIn(this.logInForm.value as User).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        this.authService.notifyLogIn(data.user);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login sucessful !' });
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1000);
      }, error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err}` });
      }
    })
  }

  logOut(){
    this.authService.logOut();
  }

}
