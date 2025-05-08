import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/model'; 
import { MessageService } from 'primeng/api';
import { nameValidator } from '../../validators/nameValidation';
import { Subject } from 'rxjs';
import {catchError, throttleTime } from 'rxjs/operators';
import { SpaceValidator } from '../../validators/spaceValidation';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  otp!: string;
  otpSent: boolean = false;
  otpVerified: boolean = false;
  signUpForm!:FormGroup;
  time:number=60;


  private sendOtpSubject = new Subject<void>();
  private verifyOtpSubject = new Subject<void>();
  private submitSubject = new Subject<void>();

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {
    this.sendOtpSubject.pipe(throttleTime(5000)).subscribe(() => {
      this.performSendOtp();
    });

    this.verifyOtpSubject.pipe(throttleTime(5000)).subscribe(() => {
      this.performVerifyOtp();
    });

    this.submitSubject.pipe(throttleTime(5000)).subscribe(() => {
      this.performSubmit();
    });
  }

  ngOnInit() { 
    this.signUpForm=new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), nameValidator.validator]),
      email: new FormControl('', [Validators.required, Validators.email, SpaceValidator.validator]),
      role: new FormControl('Employee', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), SpaceValidator.validator])
    });
  }

  onSubmit() {
    this.submitSubject.next();
  }

  private performSubmit() {
    if (this.otpVerified) {
      this.authService.signUp(this.signUpForm.value as User).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${data.message}` });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: `Email is not verified` });
    }
  }

  sendOtp() {
    this.sendOtpSubject.next();
  }

  private performSendOtp() {
    if (this.signUpForm.value.email) {
      this.authService.sendOtpForSignUp(this.signUpForm.value.email).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${data.message}` });
          this.otpSent = true;
          
          setInterval(()=>{
            if(this.time>0){
              this.time=this.time-1;
            }else{
              this.time=60;
              this.otpSent=false;
            }
          },1000)
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err}` });
          this.otpSent = false;
        }
      });
    }
  }

  verifyOtp(): void {
    this.verifyOtpSubject.next();
  }

  private performVerifyOtp(): void {
    if (this.otp) {
      this.authService.verifyOtp(this.signUpForm.value.email!, this.otp).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${data.message}` });
          this.otpVerified = true;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err}` });
          this.otpVerified = false;
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: `Enter OTP` });
      this.otpVerified = false;
    }
  }
}
