import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private router:Router){}

  handleError(error: any): void {
    console.error('An error occurred:', error);
    
    Swal.fire({
      title: 'Oops!',
      text: 'Something went wrong. Please try again later !',
      icon: 'error',
      confirmButtonText: 'OK'
    });

    this.router.navigate(['/home']);
  }
}

