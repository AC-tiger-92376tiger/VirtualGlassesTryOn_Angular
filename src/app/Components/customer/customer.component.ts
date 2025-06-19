
import { Component, OnInit } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';



@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})



export class CustomerComponent implements OnInit {
  
  
  ngOnInit(): void {
    //this.loadUsers();
    //this.filteredUsers = [...this.users];
  }
  
}

