"use strict";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";
import "./style.css";
import { Scene } from "three";

class App {
  constructor() {
    // create WebGLRenderer
    this.canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;

    // create camera
    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 1.5, -3);

    // create OrbitControls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.target.set(0, 1, 0);
    this.controls.update();

    // create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#000000");

    // 바닥 메쉬 생성
    {
      const planeSize = 40;
      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0xffffff,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);

      planeMesh.rotation.x = Math.PI * -0.5;
      this.scene.add(planeMesh);
    }

    // 조명(직사광) 생성
    {
      const color = 0xffffff;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);

      light.castShadow = true;
      light.position.set(20, 100, 30);
      light.target.position.set(-55, 4, -45);
      light.shadow.bias = -0.004;

      this.scene.add(light);
      this.scene.add(light.target);
    }

    // 그림자용 카메라는 나중에 생성

    // load VRM
    const loader = new GLTFLoader();
    loader.load("./models/motion-girl.vrm", (gltf) => {
      VRM.from(gltf).then((vrm) => {
        this.scene.add(vrm.scene);
        // console.log(vrm);
      });
    });

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
