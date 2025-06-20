import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-glb-viewer',
  templateUrl: './three-dviewer.component.html',
  styleUrls: ['./three-dviewer.component.css']
})
export class ThreeDViewerComponent implements AfterViewInit {
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;

  ngAfterViewInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, this.rendererContainer.nativeElement.clientWidth / this.rendererContainer.nativeElement.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xf0f0f0); // Light gray background

    renderer.setSize(this.rendererContainer.nativeElement.clientWidth, this.rendererContainer.nativeElement.clientHeight);

    this.rendererContainer.nativeElement.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 4);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load('assets/models/glasses.glb', (gltf: GLTF) => {
      scene.add(gltf.scene);
    }, undefined, (error: any) => {
      console.error(error);
    });

    camera.position.z = 0.3;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }
}
