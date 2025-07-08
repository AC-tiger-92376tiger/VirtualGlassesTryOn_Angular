import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    //StoreModule.forRoot({selectId: selectIdReducer}),
  ],
  template: `
  <router-outlet>
  </router-outlet>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
