
import { Component, OnInit } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ComponentFactoryResolver } from '@angular/core';
import { AdduserComponent } from '../adduser/adduser.component';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { UserService } from '../../shared/Services/user.service';
import { UserModel } from '../../shared/models/usermodel.model';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})



export class UsersComponent implements OnInit {
  users: UserModel[] = [];
  filteredUsers: UserModel[] = [];
  searchTerm = '';
  @ViewChild('main', { read: ViewContainerRef }) mainContainer!: ViewContainerRef;
  
  constructor( private resolver: ComponentFactoryResolver, private userService: UserService ) { }

  ngOnInit(): void {
    this.loadUsers();
    //this.filteredUsers = [...this.users];
  }
  ngAfterViewInit(): void {
    //this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }
  loadAddUserComponent(): void {
    const factory = this.resolver.resolveComponentFactory(AdduserComponent);
    const componentRef = this.mainContainer.createComponent(factory);

    // Apply modal styles
    const modalElement = componentRef.location.nativeElement;
    modalElement.style.position = 'fixed';
    modalElement.style.top = '50%';
    modalElement.style.left = '50%';
    modalElement.style.transform = 'translate(-50%, -50%)';
    modalElement.style.zIndex = '1000';
    modalElement.style.backgroundColor = 'white';
    modalElement.style.padding = '20px';
    modalElement.style.borderRadius = '8px';
    modalElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    // Close modal logic
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
      componentRef.destroy(); // Destroy the modal component
    });
    modalElement.appendChild(closeButton);
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    /*
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );*/
  }

  deleteUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
    this.searchUsers(); // Refresh search results
  }
}

