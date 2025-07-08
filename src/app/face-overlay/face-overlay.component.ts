import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input
  
} from '@angular/core';
import * as faceapi from 'face-api.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SharedModule } from '../shared/shared.module';
// import html2canvas from 'html2canvas';
// import { HostListener } from '@angular/core';
//import { any } from 'three/src/nodes/TSL.js';
import { SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectIdState } from '../store/select-id.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-face-overlay',
  templateUrl: './face-overlay.component.html',
  styleUrls: ['./face-overlay.component.css'],
  imports: [SharedModule]
})
export class FaceOverlayComponent implements AfterViewInit {
  @ViewChild('video',  { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas',  { static: false }) canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('imageRef',  { static: false }) imageRef!: ElementRef<HTMLImageElement>;
  
  selectId$: Observable<string | null>;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  glassesMesh!: THREE.Object3D;
  currentStream:     MediaStream | null = null;

  @Input() glassesModelUrl!: string;
  @Input() mediaType!: string;
  @Input() filepath!: any;
  showVideo=false;

  scene_height: number=0;
  scene_width: number=0;
  scene_rate: number=1;
  //viewReady=false;
  constructor(private store: Store<{ selectId: SelectIdState }>) {
    this.selectId$ = this.store.select((state) => state.selectId.select_id);
  }
  ngOnInit(): void {
    this.showVideo=true;
    this.selectId$.subscribe((modelpath) => {
      
      this.glassesModelUrl = modelpath!;
      if (this.renderer?.domElement && this.canvasRef.nativeElement.contains(this.renderer.domElement)) {
        this.canvasRef.nativeElement.removeChild(this.renderer.domElement);
      }
      if (this.mediaType === 'Image') {
        this.onImageLoaded();
      } else {
        this.setupThree();
        this.detectFace();
      }
    });
}
ngOnChanges(changes: SimpleChanges): void{
  
  this.showVideo=true;
  
  if (this.renderer?.domElement && this.canvasRef.nativeElement.contains(this.renderer.domElement)) {
    this.canvasRef.nativeElement.removeChild(this.renderer.domElement);
  }
  if (changes['filepath']) {
    
    this.initializeOverlay(); // Your logic here
  }else{
/*
  if(changes['glassesModelUrl'])
  {


    if(this.mediaType === "Image"){
      //this.showVideo=false;

      this.onImageLoaded();
    }
    else{
      this.setupThree();
      this.detectFace();
    }
  
  }*/
}
}
async initializeOverlay(){
  
  
  await this.loadModels();
  if(this.mediaType === "Video"){
    this.showVideo=true;
    this.onVideoUpload();
  }
  if(this.mediaType === "Camera"){
    this.showVideo=true;
    await this.startCamera();
  }
  if(this.mediaType === "Image"){
    this.closeCamera();
    this.showVideo=false;

  }

}
  async ngAfterViewInit() {
    //this.viewReady=true
  }
  
  async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/assets/models');
  }
 
  onVideoUpload() {
    //const file = "assets/screen.webm";
    //const file = event.target.files[0];
    //if (!file) return;  
    const video = this.videoRef.nativeElement;
    video.src = typeof this.filepath === 'string' 
  ? this.filepath 
  : URL.createObjectURL(this.filepath);

    video.load();
  //video.play();
    //console.log(video.src);
    video.onloadedmetadata = () => {
      //video.play();
      this.setupThree();
 
    //this.detectFace();
      //this.onResize(); // <- resize overlay and threeCanvas to match video
      this.detectFace();
    };
    
  }
  ngOnDestroy() {
  }
  closeCamera() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop());
      this.currentStream = null;
    }
  }
  
  async startCamera() {
    const constraints = {
      video: { deviceId: { exact: this.filepath } }
    };
    //this.media_path=selectedDeviceId;  
    
    const Stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = this.videoRef.nativeElement;
    video.srcObject = Stream;
    video.play();
    this.currentStream=Stream;
    video.onloadedmetadata = () => {
      //video.play();
      this.setupThree();
 
    //this.detectFace();
      //this.onResize(); // <- resize overlay and threeCanvas to match video
      this.detectFace();
    };


  }
 
  setupThree() {
    let width = this.videoRef.nativeElement.offsetWidth;
    let height = this.videoRef.nativeElement.offsetHeight;
    let V_width = this.videoRef.nativeElement.videoWidth;
    let V_height = this.videoRef.nativeElement.videoHeight;
    let V_rate = V_width/V_height;//rate2
    let rate = width/height;//rate1

    //let scene_height: number=0;
    //let scene_width: number=0;
    let scene_margin_width: number=0;
    let scene_margin_height: number=0;

    if(width/height>V_rate)
    {
      this.scene_height = this.videoRef.nativeElement.offsetHeight;
      this.scene_width = width*V_rate/rate;
      scene_margin_width = (width-this.scene_width)/2;
      //this.scene_rate =this.scene_height/ V_height;
    }
    else
    {
      this.scene_width=this.videoRef.nativeElement.offsetWidth;
      this.scene_height = height*rate/V_rate;
      scene_margin_height = (height-this.scene_height)/2;
      
      
      
    }
    //console.log(this.scene_width);
    this.scene_rate = this.scene_width/V_width;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.scene_width / this.scene_height, 0.1, 1000);
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.scene_width, this.scene_height);
    
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = 'absolute'; // or 'fixed', 'relative'
    //this.renderer.domElement.style.position = 'absolute'; // or 'fixed', 'relative'
    
    
    this.renderer.domElement.style.left = `${scene_margin_width}px`;
    this.renderer.domElement.style.top = `${scene_margin_height-40}px`;
    const loader = new GLTFLoader();
    loader.load(`/assets/models/${this.glassesModelUrl}_face.glb`, (gltf) => {
    //loader.load('/assets/models/glasses_face.glb', (gltf) => {
      //gltf.scene.scale.set(1,1,1);
      const model=gltf.scene;
      model.scale.set(1,1,1);
      //console.log("load model")
      this.glassesMesh = model;
      this.scene.add(this.glassesMesh);
    });
  }

  async detectFace() {
    
    // if(!this.renderer.domElement)
    // {
    // this.canvasRef.nativeElement.removeChild(this.renderer.domElement);

    // }
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait one tick for DOM render
    
    if (!this.videoRef?.nativeElement) {
      console.error("DOM elements not available yet.");
      return;
    }
      const video = this.videoRef.nativeElement;
      
      setInterval(async () => 
        this.AlignGlasses(video), 100);  
      
  }
  async AlignGlasses(video:any){
    const result = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true);
        
      if (result && result.landmarks) {
        
        const leftEye = this.centerOf(result.landmarks.getLeftEye());
        const rightEye = this.centerOf(result.landmarks.getRightEye());
        const nose = result.landmarks.getNose()[3];
        const eyeMid = this.midpoint(leftEye, rightEye);
        const eyeDist = this.distance(leftEye, rightEye);
        
        // Position glasses
        const xNorm = (eyeMid.x / video.videoWidth) * 2 - 1;
        const yNorm = -((eyeMid.y / video.videoHeight) * 2 - 1);
        const vector = new THREE.Vector3(xNorm, yNorm , 0.5);//+0.02
        vector.unproject(this.camera);
        this.glassesMesh.position.copy(vector);
        
        const leftToRight = new THREE.Vector3(
          rightEye.x - leftEye.x,
          rightEye.y - leftEye.y,
          0
        ).normalize();
        
        const eyeMidVector = new THREE.Vector3(
          (leftEye.x + rightEye.x) / 2,
          (leftEye.y + rightEye.y) / 2,
          0
        );
        const noseVector = new THREE.Vector3(nose.x, nose.y, 0).sub(eyeMidVector).normalize();
        
        // Swap axes: you can define Z to always point "out" of the screen
        const zAxis = new THREE.Vector3(0, 0, 1);
        const xAxis = leftToRight;
        const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
        const correctedZ = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
        //correctedZ.negate();
        
        const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, correctedZ);
        const euler = new THREE.Euler().setFromRotationMatrix(rotationMatrix, 'XYZ');
        euler.z *= -1;
        this.glassesMesh.rotation.copy(euler);
        
        // Rotation
        /*
        const xAxis = new THREE.Vector3(rightEye.x - leftEye.x, rightEye.y - leftEye.y, 0).normalize();
        const eyeToNose = new THREE.Vector3(nose.x - eyeMid.x, nose.y - eyeMid.y, 0).normalize();
        const zAxis = new THREE.Vector3().crossVectors(xAxis, eyeToNose).normalize();
        const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
        
        const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
        const eulerRotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix, 'XYZ');
        this.glassesMesh.rotation.copy(eulerRotation);*/
        // this.glassesMesh.position.lerp(vector, 0.3);
        // this.glassesMesh.rotation.x += (eulerRotation.x - this.glassesMesh.rotation.x) * 0.3;
        // this.glassesMesh.rotation.y += (eulerRotation.y - this.glassesMesh.rotation.y) * 0.3;
        // this.glassesMesh.rotation.z += (eulerRotation.z - this.glassesMesh.rotation.z) * 0.3;
        
        // Scale
        const scale = this.scene_rate*1.3;
        this.glassesMesh.scale.set(scale, scale, scale);
        this.renderer.render(this.scene, this.camera);
      }
  }

  async onImageLoaded() {
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait one tick for DOM render
    
    if (!this.imageRef?.nativeElement || !this.canvasRef?.nativeElement) {
      console.error("DOM elements not available yet.");
      return;
    }
    const img = this.imageRef.nativeElement;
    // if(this.renderer.domElement)
    // {
    //    //this.canvasRef.nativeElement.removeChild();
  
    // }
    // Set canvas size
    //canvas.width = img.width;
    //canvas.height = img.height;

    // Detect face
    const result = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true);

    if (!result || !result.landmarks) {
      console.warn('No face detected');
      return;
    }

    // Eye centers
    const leftEye = this.centerOf(result.landmarks.getLeftEye());
    const rightEye = this.centerOf(result.landmarks.getRightEye());
    const eyeMid = this.midpoint(leftEye, rightEye);
    const eyeDist = this.distance(leftEye, rightEye);
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    // Setup Three.js
    this.setupThreeImage( img.width, img.height);

    // Load glasses and align
    const loader = new GLTFLoader();
    loader.load(`/assets/models/${this.glassesModelUrl}_face.glb`, (gltf) => {
    //loader.load('/assets/models/glasses_face.glb', (gltf) => {
      this.glassesMesh = gltf.scene;
      const xNorm = (eyeMid.x / img.naturalWidth) * 2 - 1;
      const yNorm = -((eyeMid.y / img.naturalHeight) * 2 - 1);
      
      const pos = new THREE.Vector3(xNorm+0.1, yNorm+0.6, 0.5).unproject(this.camera);
      this.glassesMesh.position.copy(pos);
      const scale = eyeDist/img.naturalWidth*40 ;
      this.glassesMesh.scale.set(scale, scale, scale);
      //this.glassesMesh.scale.set(1, 1, 1);
      
      this.scene.add(this.glassesMesh);
      this.renderer.render(this.scene, this.camera);
    });
  }

 

   
  
  setupThreeImage( width: number, height: number) {
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ alpha: true , antialias: true,
    });
    this.renderer.setSize(width, height);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

  }
  centerOf(points: faceapi.Point[]) {
    const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x: avgX, y: avgY };
  }

  midpoint(p1: any, p2: any) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }

  distance(p1: any, p2: any) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
}
