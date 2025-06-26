import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Input } from '@angular/core';
import { ApplicationRef } from '@angular/core';
@Component({
  selector: 'app-glb-viewer',
  templateUrl: './three-dviewer.component.html',
  styleUrls: ['./three-dviewer.component.css']
})
export class ThreeDViewerComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;
  @Input() src!: string;
  renderer: THREE.WebGLRenderer | null=null;//({ antialias: true });
  animationId: number | null = null;
  constructor(private appRef: ApplicationRef) {}

  ngOnInit(): void {
    
  }
  private initialized = false;
  ngAfterViewInit(): void {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        if (!this.initialized) {
          
          this.init();
          this.initialized = true;
        }
      }
    });
  }
  ngOnDestroy() {
    this.disposeRenderer();
  }
disposeRenderer() {
  if (this.renderer) {
    // Stop animation
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Remove from DOM
    const dom = this.renderer.domElement;
    if (dom.parentElement) {
      dom.parentElement.removeChild(dom);
    }

    // Dispose renderer
    this.renderer.dispose();
    this.renderer = null;
  }
}
  init(){
    if (this.renderer) {
      this.disposeRenderer();
    }
    const scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    const camera = new THREE.PerspectiveCamera(30, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight, 0.1, 1000);
    this.renderer.setClearColor(0xf0f0f0); // Light gray background

    this.renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 4);
    scene.add(light);

    const loader = new GLTFLoader();
    //loader.load(`assets/models/glasses.glb`, (gltf: GLTF) => {

    loader.load(`assets/models/${this.src}.glb`, (gltf: GLTF) => {
      scene.add(gltf.scene);
    }, undefined, (error: any) => {
      console.error(error);
    });

    camera.position.z = 0.3;

    const controls = new OrbitControls(camera, this.renderer.domElement);
    controls.update();

    const animate = () => {
      this.renderer?.render(scene, camera);
      this.animationId=requestAnimationFrame(animate);
    };
    

    animate();
  }
}
