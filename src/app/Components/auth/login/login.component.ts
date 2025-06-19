import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/Services/auth.service';
import { SharedModule } from '../../../shared/shared.module';
import { UserModel } from '../../../shared/models/usermodel.model';
//import Logo from 'src/Logo_Nexora.png';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule], // Import necessary modules
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm;
  //loginuser: UserModel= { id: 0, email: '', passwordHash: '', username: '', role: '' };
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
  register() {
    this.router.navigate(['/register']);
  }
  login() {
    if (this.loginForm.invalid) return;

    //console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('loggedIn', JSON.stringify(res.loginuser));

        //this.loginuser = res.loginuser;
        //console.log(this.loginuser);
        this.error = '';
        //this.authService.setLoginUser(this.loginuser);

        this.router.navigate(['/dashboard']); 
      },
      error: () => {
        this.error = 'Invalid email or password.';
      }
    });
  }
}