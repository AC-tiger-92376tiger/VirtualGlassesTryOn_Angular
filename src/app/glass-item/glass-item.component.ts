import { Component, Input, Output, OnInit } from '@angular/core';
//import { ThreeDViewerComponent } from '../three-dviewer/three-dviewer.component';
import { SharedModule } from '../shared/shared.module';
import { Task } from '../shared/models/task.model';
import { EventEmitter } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectIdState } from '../store/select-id.state';
import { setSelectId } from '../store/select-id.actions';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-glass-item',
  imports: [SharedModule],
  templateUrl: './glass-item.component.html',
  styleUrl: './glass-item.component.css'
})
export class GlassItemComponent implements OnInit{
  //title ='Sun Glasses';
  //description ='MEGA CLUBMASTER';
  //price ='50.00';
  //isSelected = true;
  //src ='';
  selectId$: Observable<string | null>;
  @Input() state!: string;
  @Input() glasses!: Task;
  //@Input() select_id!: number;
  @Output() checkboxChanged = new EventEmitter<number>();
  checkedItem=false;

  constructor(private store: Store<{ selectId: SelectIdState }>) {
   this.selectId$ = this.store.select((state) => state.selectId.select_id);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.selectId$.subscribe((path) => {
      if(this.glasses.path !== path){
        this.checkedItem = false;
      }
    });
  }
  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkedItem=isChecked;
   
    if(isChecked)
    {
      this.store.dispatch(setSelectId({ select_id: this.glasses.path! }));
      //this.checkboxChanged.emit(this.glasses.id);
    }
  }
  /*
  ngOnChanges(changes: SimpleChanges): void{
    if (changes['select_id']) {

    if(this.select_id!==this.glasses.id)
    {
      
      this.checkedItem=false;
    }
     
    }
  }*/
}
