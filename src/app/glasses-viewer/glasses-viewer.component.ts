import { Component, Input, Output } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GlassItemComponent } from '../glass-item/glass-item.component';
import { Task } from '../shared/models/task.model';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-glasses-viewer',
  imports: [SharedModule,GlassItemComponent],
  templateUrl: './glasses-viewer.component.html',
  styleUrl: './glasses-viewer.component.css'
})
export class GlassesViewerComponent {
  
  @Input() stated!: string;
  @Input() glasses_list!: Task[];
  @Output() selected_glasses = new EventEmitter<string>();
  //@Output() checkboxChanged = new EventEmitter<string>();

 
  onCheckboxChange(path: string) {

    this.selected_glasses.emit(path);
  }
}
