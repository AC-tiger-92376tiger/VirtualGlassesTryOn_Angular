import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import * as faceapi from 'face-api.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Input } from '@angular/core';

@Component({
  selector: 'app-face-overlay',
  templateUrl: './face-overlay.component.html',
  styleUrls: ['./face-overlay.component.css'],
})
export class FaceOverlayComponent implements AfterViewInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('threeCanvas') threeCanvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() path!: string;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer!: THREE.WebGLRenderer;
  
  glassesModel!: THREE.Object3D;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['path']) {
      const prev = changes['path'].previousValue;
      const current = changes['path'].currentValue;
      //console.log(`@Input path changed from ${prev} to ${current}`);
      //const time = new Date();
      //console.log(`Changed at: ${time.toLocaleTimeString()}`);
      //this.renderer.clear();
      this.setupThree();
      // If needed, reload the model
      // this.loadGlassesModel(current);
    }
  }
  async ngAfterViewInit() {
    window.addEventListener('resize', () => this.onResize());
    await this.loadModels();
    
    
  }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  }

  onResize() {
    const container = this.videoRef.nativeElement.parentElement?.parentElement!;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
  
    // Resize HTML canvas
    this.overlayRef.nativeElement.width = width;
    this.overlayRef.nativeElement.height = height;
    this.threeCanvasRef.nativeElement.width = width;
    this.threeCanvasRef.nativeElement.height = height;
  
    // Resize WebGLRenderer
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  onVideoUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const video = this.videoRef.nativeElement;
    video.src = URL.createObjectURL(file);
    video.load();
    video.onloadedmetadata = () => {
      video.play();
      this.onResize(); // <- resize overlay and threeCanvas to match video

      this.detectAndRender(video);
    };
  }

  setupThree() {
    const canvas = this.threeCanvasRef.nativeElement;
    

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    //this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 10;

    const loader = new GLTFLoader();
    this.scene.clear();
    //loader.load(`/assets/models/orange_sunglasses_face.glb`, (gltf) => {
    loader.load(`/assets/models/${this.path}_face.glb`, (gltf) => {
      this.glassesModel = gltf.scene;
      this.glassesModel.scale.set(1, 1, 1);
      this.glassesModel.rotation.set(0,0,0);
      this.glassesModel.position.set(0,0,0);
      this.scene.add(this.glassesModel);

      const video = this.videoRef.nativeElement;
      if (!video.paused) {
        this.detectAndRender(video);
  }
    });
   
  }

  async detectAndRender(video: HTMLVideoElement) {
    const overlayCanvas = this.overlayRef.nativeElement;
    overlayCanvas.width = video.videoWidth;
    overlayCanvas.height = video.videoHeight;

    faceapi.matchDimensions(overlayCanvas, { width: video.videoWidth, height: video.videoHeight });
    video.addEventListener('play', () => {
      const interval = setInterval(async () => {
        if (video.paused || video.ended) {
          clearInterval(interval);
          return;
        }

          const result = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks(true);

          const ctx = overlayCanvas.getContext('2d')!;
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

          if (result?.landmarks && this.glassesModel) {
            const leftEye = this.centerOf(result.landmarks.getLeftEye());
            const rightEye = this.centerOf(result.landmarks.getRightEye());
              
            const eyeMid = this.midpoint(leftEye, rightEye);
            const eyeDist = this.distance(leftEye, rightEye);
            
             const normX = (eyeMid.x / video.videoWidth) * 2 - 1;
             const normY = -((eyeMid.y / video.videoHeight) * 2 - 1);
             console.log(video.videoWidth+ ", "+video.videoHeight);
             // Translate to 3D world coordinates
             this.glassesModel.position.set(normX * 5 + 0.1 , normY * 5 - 0.1, 0);
            
            //this.glassesModel.position.set(x, y, 0);

            //this.glassesModel.position.set(eyeMid.x / 40 - 6, -eyeMid.y / 40 + 4, 0);
            this.glassesModel.scale.set(eyeDist / 8, eyeDist / 8, eyeDist / 10);

            this.renderer.render(this.scene, this.camera);


          }
      }, 100);
    });
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