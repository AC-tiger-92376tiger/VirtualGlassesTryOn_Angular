import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/Services/user.service';

@Component({
  selector: 'app-adduser',
  imports: [],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent {
  adduserForm;
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.adduserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
}
