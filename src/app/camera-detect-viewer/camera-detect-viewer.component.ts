import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-camera-face-detect',
  templateUrl: './camera-detect-viewer.component.html',
  styleUrls: ['./camera-detect-viewer.component.css']
})
//export class CameraFaceDetectComponent implements OnInit, AfterViewInit {
  // @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  // @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;

  // async ngOnInit() {
  //   await this.loadModels();
  // }

  // ngAfterViewInit() {
  //   this.startCamera();
  // }

  // async loadModels() {
  //   // Load Face API models from public assets or CDN
  //   const MODEL_URL = '/assets/models'; // Put your downloaded models here or use CDN

  //   await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  //   // You can load other models if needed (e.g., landmarks, expressions)
  // }

  // startCamera() {
  //   navigator.mediaDevices.getUserMedia({ video: {} })
  //     .then(stream => {
  //       this.videoRef.nativeElement.srcObject = stream;
  //       this.videoRef.nativeElement.play();
  //       this.detectFaces();
  //     })
  //     .catch(err => {
  //       console.error('Camera error:', err);
  //     });
  // }

  // async detectFaces() {
  //   const video = this.videoRef.nativeElement;
  //   const canvas = this.overlayRef.nativeElement;
  //   const displaySize = { width: video.videoWidth, height: video.videoHeight };

  //   faceapi.matchDimensions(canvas, displaySize);

  //   video.addEventListener('play', () => {
  //     const interval = setInterval(async () => {
  //       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

  //       // Resize detections to video size
  //       const resizedDetections = faceapi.resizeResults(detections, displaySize);

  //       // Clear previous drawings
  //       const ctx = canvas.getContext('2d')!;
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       // Draw boxes on detected faces
  //       faceapi.draw.drawDetections(canvas, resizedDetections);
  //     }, 100); // Detect every 100ms (~10 FPS)
  //   });
  // }
export class CameraFaceDetectComponent implements AfterViewInit {

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;

  async ngAfterViewInit() {
    await this.loadModels();
  }

  async loadModels() {
    const MODEL_URL = '/assets/models'; // Local path to face-api.js models
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }

  onVideoUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const video = this.videoRef.nativeElement;
      video.src = URL.createObjectURL(file);
      video.load();

      video.onloadedmetadata = () => {
        video.play();
        this.runFaceDetection(video);
      };
    }
  }

  runFaceDetection(video: HTMLVideoElement) {
    const canvas = this.overlayRef.nativeElement;
  
    video.addEventListener('play', () => {
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
  
      if (!displaySize.width || !displaySize.height) {
        console.error('Invalid video dimensions');
        return;
      }
  
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);
  
      const interval = setInterval(async () => {
        if (video.paused || video.ended) {
          clearInterval(interval);
          return;
        }
  
        try {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
          const resized = faceapi.resizeResults(detections, displaySize);
  
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resized);
        } catch (err) {
          console.error('Face detection error:', err);
        }
      }, 100);
    });
  }
  
  
}
