import { Component, Input, Output } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GlassItemComponent } from '../glass-item/glass-item.component';
import { Task } from '../shared/models/task.model';
import { EventEmitter } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectIdState } from '../store/select-id.state';
import { setSelectId } from '../store/select-id.actions';

@Component({
  selector: 'app-glasses-viewer',
  imports: [SharedModule,GlassItemComponent],
  templateUrl: './glasses-viewer.component.html',
  styleUrl: './glasses-viewer.component.css'
})
export class GlassesViewerComponent {
  
  @Input() stated!: string;
  @Input() glasses_list!: Task[];
  @Input() selected_ID!:number;
  @Output() selected_glasses = new EventEmitter<number>();
  //@Output() checkboxChanged = new EventEmitter<string>();
  
  constructor(private store: Store<{ selectId: SelectIdState }>) {}
 
  onCheckboxChange(id: number) {
    this.selected_glasses.emit(id);
  }
  ngOnChanges(changes: SimpleChanges): void{
    if (changes['selected_ID']) {
     
    }
  }
}
