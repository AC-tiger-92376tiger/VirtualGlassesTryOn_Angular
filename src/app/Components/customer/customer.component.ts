
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
  imports: [SharedModule, FaceOverlayComponent, GlassesViewerComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})



export class CustomerComponent implements OnInit {
  glasses_List: Task[]=[];
  leftglasses_List: Task[]=[];
  rightglasses_List: Task[]=[];
  //glasses: any[] = [];
  selected_glasses!: string;
  selected_id: number=-1;
  media_path!: any;
  //cameraID!: any;
  types = ['Video', 'Camera', 'Image',];
  selectedType = '';
  ShowView=false;
  //rightViewerCount: number=0;
  //leftViewerCount: number=0;
  camera_list: any[]=[];
  constructor(
    private glassesService: TaskService,) {
  }
  ngOnInit(): void {
    //this.selected_glasses="glasses";
      this.glasses_List=[
        {
        "id":1,
        "title":"Sun Glasses",
        "description":"MEGA CLUBMASTER",
        "path":"orange_sunglasses",
        "price":50},
        {
          "id":2,
          "title":"Coffee Glasses",
          "description":"Good Health",
          "path":"glasses","price":120},
        {
          "id":3,
          "title":"PLASTIC",
          "description":"MADE WITH PLASTIC",
          "path":"plastic_sunglasses",
          "price":10},
          {
            "id":4,
            "title":"Sun Glasses",
            "description":"MEGA CLUBMASTER",
            "path":"glasses",
            "price":50},
            {
              "id":5,
              "title":"Coffee Glasses",
              "description":"Good Health",
              "path":"glasses","price":120},
            {
              "id":6,
              "title":"PLASTIC",
              "description":"MADE WITH PLASTIC",
              "path":"glasses",
              "price":10}
              
        ];
        //this.loadGlasses();
        //this.filteredUsers = [...this.users];
        this.SeperateCount();
      }
      ngAfterViewInit(){
    this.listCameras();

  }
   async loadGlasses(){
    const glasses_part = localStorage.getItem('glasses_list');
      if(glasses_part)
      {
        this.glasses_List = JSON.parse(glasses_part);
      }
      else{
        try {
          this.glasses_List = await this.glassesService.getGlassesList();
        } catch (err) {
          console.error('Error fetching users:', err);
        }
        localStorage.setItem('glasses_list',JSON.stringify(this.glasses_List));
      }
    
  }
  onSelectGlasses(id: number){
    this.selected_id=id;

    for(let glasses of this.glasses_List)
    {
      if(id===glasses.id)
      {
        this.selected_glasses = glasses.path!;
        //console.log(glasses.path);
      }
      
    }
  }
  onCameraSelect(event: Event){      
    this.ShowView=true;
  }
  async listCameras() {
    if(this.camera_list.length!==0) return;
    //await navigator.mediaDevices.getUserMedia({ video: true });
    //navigator.mediaDevices.getUserMedia({video:true});
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
  
        this.camera_list = devices.filter(device => device.kind === 'videoinput');
        
      })
      .catch(err => console.error('Error listing cameras:', err));
      console.log(this.camera_list);

  }
  async SeperateCount(){
    let count=this.glasses_List.length;
      for(let i=0;i<count;i++)
      {
        if(i%2===0)
        {
          this.leftglasses_List.push(this.glasses_List[i]);
        }else
        {
          this.rightglasses_List.push(this.glasses_List[i]);
        }
    }
  }

  /*
  onImageUpload(event: any){
    const file = event.target.files[0];
    if (!file) return;
    this.media_path=URL.createObjectURL(file);  
  }*/
    
    onTypeChange(event: Event) {
    //console.log("3");

      const selectedValue = (event.target as HTMLSelectElement).value;
      if (selectedValue !== this.selectedType) {
        this.selectedType = selectedValue;
        
        this.ShowView = false;
      }
     
    }
            
    onVideoUploadafter(event: any) {
      const file = event.target.files[0];
      if (!file) return;
      this.media_path = URL.createObjectURL(file);
      //this.toggleOverlay();
      this.ShowView=true;
    }
    
  
  toggleOverlay() {
    this.ShowView = false;
    /*
    setTimeout(() => {
      this.ShowView = true;
    }, 1);
    */
  }
  
  
}

