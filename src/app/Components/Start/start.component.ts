import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { AuthLayout } from '@/components/auth-layout'


@Component({
  selector: 'app-dashboard',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent{

  constructor(private router: Router) {
    
  }
  ngOnInit(): void {
    this.checkToken();
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, navigate to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Token does not exist, navigate to login
      //this.router.navigate(['/login']);
    }
  }
  login() {
    this.router.navigate(['/login']);
  }

}
