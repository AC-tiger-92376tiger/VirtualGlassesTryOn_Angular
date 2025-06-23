import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/Services/task.service';
import { Task } from '../../shared/models/task.model';
import { SharedModule } from '../../shared/shared.module';
import { GlassesViewerComponent } from '../../glasses-viewer/glasses-viewer.component';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [SharedModule, GlassesViewerComponent],
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
  glasses_List: Task[]=[];
  //glasses: any[] = [];
  //selected_glasses!: string;
  constructor(
    private glassesService: TaskService,) {
  }
  ngOnInit(): void {
    this.loadGlasses();
    //this.filteredUsers = [...this.users];
  }
  async loadGlasses(){
    try {
      this.glasses_List = await this.glassesService.getGlassesList();
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    
  }
}
