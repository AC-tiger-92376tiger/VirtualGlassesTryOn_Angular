
import { Component, OnInit } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FaceOverlayComponent } from '../../face-overlay/face-overlay.component';



@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [SharedModule, FaceOverlayComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})



export class CustomerComponent implements OnInit {
  
  
  ngOnInit(): void {
    //this.loadUsers();
    //this.filteredUsers = [...this.users];
  }
  
}

