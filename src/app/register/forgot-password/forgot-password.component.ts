import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { SpaceValidator } from '../../validators/spaceValidation';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: false
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  otp!: string;
  otpSent = false;
  otpVerified = false;
  time:number=60;

  private sendOtpSubject = new Subject<void>();
  private verifyOtpSubject = new Subject<void>();
  private submitSubject = new Subject<void>();

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
    //use throttling to prevent multiple api request
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

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, SpaceValidator.validator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), SpaceValidator.validator])
    });
  }

  sendOtp(): void {
    // console.log("send otp called");
    this.sendOtpSubject.next();
  }

  private performSendOtp(): void {
    this.authService.sendOtpForPassword(this.forgotPasswordForm.value.email).subscribe({
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

  verifyOtp(): void {
    this.verifyOtpSubject.next();
  }

  private performVerifyOtp(): void {
    if (this.otp) {
      this.authService.verifyOtp(this.forgotPasswordForm.value.email, this.otp).subscribe({
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

  onSubmit(): void {
    // console.log("on submit calles");
    this.submitSubject.next();
  }

  private performSubmit(): void {
    if (this.forgotPasswordForm.valid && this.otpVerified) {
      this.authService.changePassword(this.forgotPasswordForm.value).subscribe({
        next: (data) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${data.message}` });
          setTimeout(() => {
            this.router.navigate(['/logIn']);
          }, 1000);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err}` });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: `OTP is not verified!` });
    }
  }
}
