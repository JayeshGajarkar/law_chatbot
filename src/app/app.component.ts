import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './models/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project';
  currUser: User | null = null;
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.userLoign.subscribe(user => {
      this.currUser = user;
    });
  }

  isLoggedIn() {
    return this.currUser !== null;
  }

  logOut(){
    this.authService.logOut();
  }
    
}
