import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-face-overlay',
  templateUrl: './face-overlay.component.html',
  styleUrls: ['./face-overlay.component.css'],
})
export class FaceOverlayComponent implements AfterViewInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('threeCanvas') threeCanvasRef!: ElementRef<HTMLCanvasElement>;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer!: THREE.WebGLRenderer;
  glassesModel!: THREE.Object3D;

  async ngAfterViewInit() {
    await this.loadModels();
    this.setupThree();
  }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
  }

  onVideoUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const video = this.videoRef.nativeElement;
    video.src = URL.createObjectURL(file);
    video.load();
    video.onloadedmetadata = () => {
      video.play();
      this.detectAndRender(video);
    };
  }

  setupThree() {
    const canvas = this.threeCanvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.z = 10;

    const loader = new GLTFLoader();
    loader.load('/assets/models/glasses_face.glb', (gltf) => {
      this.glassesModel = gltf.scene;
      this.glassesModel.scale.set(1, 1, 1);
      this.scene.add(this.glassesModel);
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

        if (result && result.landmarks && this.glassesModel) {
          const leftEye = this.centerOf(result.landmarks.getLeftEye());
          const rightEye = this.centerOf(result.landmarks.getRightEye());

          const eyeMid = this.midpoint(leftEye, rightEye);
          const eyeDist = this.distance(leftEye, rightEye);

          // Normalize based on video dimensions
          const xNorm = (eyeMid.x / video.videoWidth) * 2 - 1; // [-1, 1]
          const yNorm = -((eyeMid.y / video.videoHeight) * 2 - 1); // [-1, 1] and flip Y

          // Set glasses position in NDC space projected to 3D
          const vector = new THREE.Vector3(xNorm, yNorm+0.07, 0.5); // z=0.5 is arbitrary depth
          vector.unproject(this.camera);
          this.glassesModel.position.copy(vector);

          // Adjust scale based on eye distance
          const scale = eyeDist / video.videoWidth * 10; // tweak the multiplier for realism
          this.glassesModel.scale.set(scale, scale, scale);

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