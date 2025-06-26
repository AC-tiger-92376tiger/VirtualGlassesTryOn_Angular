import { Component, Input, Output } from '@angular/core';
import { ThreeDViewerComponent } from '../three-dviewer/three-dviewer.component';
import { SharedModule } from '../shared/shared.module';
import { Task } from '../shared/models/task.model';
import { EventEmitter } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-glass-item',
  imports: [ThreeDViewerComponent, SharedModule],
  templateUrl: './glass-item.component.html',
  styleUrl: './glass-item.component.css'
})
export class GlassItemComponent {
  //title ='Sun Glasses';
  //description ='MEGA CLUBMASTER';
  //price ='50.00';
  //isSelected = true;
  //src ='';
  @Input() state!: string;
  @Input() glasses!: Task;
  @Input() select_id!: number;
  @Output() checkboxChanged = new EventEmitter<number>();
  checkedItem=false;

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkedItem=isChecked;
    if(isChecked)
      this.checkboxChanged.emit(this.glasses.id);
  }
  ngOnChanges(changes: SimpleChanges): void{
    if (changes['select_id']) {
    if(this.select_id!==this.glasses.id)
    {
      
      this.checkedItem=false;
    }
     
    }
  }
}
