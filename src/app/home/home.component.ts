import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) { }
  
  submitForm() {
    alert('Form submitted!');
  }

  startChat() {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(form:NgForm){
    alert("Submited !")
    console.log(form.value);
    form.reset();
  }
}
