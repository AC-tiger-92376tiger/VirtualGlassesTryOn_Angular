import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

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
    //this.checkToken();    
  }
  ngAfterViewInit(): void {
    // Load the ChartComponent after ViewChild is initialized
    //this.loadChartComponent();
    
    
  }
  openSetting(): void {
    this.router.navigate(['/setting-page']);
    //
  }
  openCustomer(): void {
    this.router.navigate(['/customer-page']);
  }
  checkToken(): void {
    
    const token = localStorage.getItem('token');
    if (token) {
      
            
    } else {
      this.router.navigate(['/login']);
    }
  }

}
