import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logInGuard: CanActivateFn = (route, state) => {
  const logInService=inject(AuthService);
  const router=inject(Router);
  
  if (!logInService.isLoggedIn()) {
    alert('You need to log in first!');
    router.navigate(['/login']);
    return  false;
  }else{
    return true;
  }
};
