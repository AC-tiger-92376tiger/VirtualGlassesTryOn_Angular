import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { TaskComponent } from '../task/task.component';
import { ChartComponent } from '../chart/chart.component';
//import { RouterOutlet } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { TaskBoardComponent } from '../task-board/task-board.component';
import { AuthService } from '../../shared/Services/auth.service';
import { HostListener } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserModel } from '../../shared/models/usermodel.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SharedModule]

})
export class DashboardComponent implements OnInit {
  @ViewChild('main', { read: ViewContainerRef }) mainContainer!: ViewContainerRef;
  loginuser: any=null; 
  isOpen = false;
  isAdmin = false;
  constructor(
    private router:Router,
    private resolver: ComponentFactoryResolver
  ) { }


  ngOnInit(): void {
    this.checkToken();    
  }
  ngAfterViewInit(): void {
    // Load the ChartComponent after ViewChild is initialized
    this.loadChartComponent();
    
    
  }

  checkToken(): void {
    /*
    const token = localStorage.getItem('token');
    if (token) {
      const loginpart = localStorage.getItem('loggedIn');
      if(loginpart)
      {
        this.loginuser = JSON.parse(loginpart);
        if(this.loginuser.role === "Admin")
          {
            this.isAdmin = true;
          }
       
        
      }
            
    } else {
      this.router.navigate(['/login']);
    }*/
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.profile-container');
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  toggleDarkMode(): void {
    const bodyElement = document.body; // Get the <html> element
    bodyElement.classList.toggle('dark'); // Toggle the 'dark' class
  }
  loadChartComponent(): void {
    const factory = this.resolver.resolveComponentFactory(ChartComponent);
    this.mainContainer.clear(); // Clear the container
    this.mainContainer.createComponent(factory); // Load ChartComponent
  }

  loadTaskComponent(): void {
    const factory = this.resolver.resolveComponentFactory(TaskBoardComponent);
    this.mainContainer.clear(); // Clear the container
    this.mainContainer.createComponent(factory); // Load TaskComponent
  }
  loadUsersComponent(): void {
    const factory = this.resolver.resolveComponentFactory(UsersComponent);
    this.mainContainer.clear(); // Clear the container
    this.mainContainer.createComponent(factory); // Load TaskComponent
  }
  
  OnSignOut(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  Addaccount(): void{
    this.router.navigate(['/register']);
  }
}
