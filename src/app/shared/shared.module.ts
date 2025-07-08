import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { selectIdReducer } from '../store/select-id.reducer'; // Adjust the path as necessary
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
@NgModule({
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ selectId: selectIdReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retain last 25 states
    }),
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {}