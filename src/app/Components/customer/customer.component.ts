
import { Component, OnInit } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FaceOverlayComponent } from '../../face-overlay/face-overlay.component';
import { ThreeDViewerComponent } from '../../three-dviewer/three-dviewer.component';
import { GlassesViewerComponent } from '../../glasses-viewer/glasses-viewer.component';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../shared/Services/task.service';
import { api } from '../../shared/axios';
import { from } from 'rxjs';
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [SharedModule, FaceOverlayComponent, ThreeDViewerComponent, GlassesViewerComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})



export class CustomerComponent implements OnInit {
  glasses_List: Task[]=[];
  //glasses: any[] = [];
  selected_glasses!: string;
  constructor(
    private glassesService: TaskService,) {
  }
  ngOnInit(): void {
    this.loadGlasses();
    //this.filteredUsers = [...this.users];
  }
   async loadGlasses(){
    
    // this.glassesService.getGlassesList().subscribe(data=>{
    //   for (const glasses of data) {
    //     this.glasses_List.push(glasses);
    //   }
    // });
    try {
      this.glasses_List = await this.glassesService.getGlassesList();
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    // this.glassesService.getGlassesList().subscribe({
    //   next: (res) => {
    //     console.log('Glasses:', res);
    //     for (const glasses of res) {
    //       this.glasses_List.push(glasses);
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Error loading glasses:', err);
    //   }
    // });
  }
  onSelectGlasses(path: string){

    this.selected_glasses=path;
  }
  
}

