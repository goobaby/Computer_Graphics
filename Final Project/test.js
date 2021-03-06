import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

const vs = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fs = `
uniform sampler2D dayTexture;
uniform sampler2D nightTexture;

uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;

void main( void ) {
  vec3 dayColor = texture2D( dayTexture, vUv ).rgb;
  vec3 nightColor = texture2D( nightTexture, vUv ).rgb;

  // compute cosine sun to normal so -1 is away from sun and +1 is toward sun.
  float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);

  // sharpen the edge beween the transition
  cosineAngleSunToNormal = clamp( cosineAngleSunToNormal * 10.0, -1.0, 1.0);

  // convert to 0 to 1 for mixing
  float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;

  // Select day or night texture based on mix.
  vec3 color = mix( nightColor, dayColor, mixAmount );

  gl_FragColor = vec4( color, 1.0 );
}

`;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 1, 3000);
camera.position.z = 4;
scene.add( camera );

const directionalLight = new THREE.DirectionalLight( 0xaaff33, 0 );
directionalLight.position.set(-1, 1, 0.5).normalize();
scene.add( directionalLight );

const textureLoader = new THREE.TextureLoader();

const uniforms = {
  sunDirection: {value: new THREE.Vector3(0,1,0) },
  dayTexture: { value: textureLoader.load( "./assests/globe/basic.jpg" ) },
  nightTexture: { value: textureLoader.load( "./assests/globe/night.jpg" ) }
};

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vs,
  fragmentShader: fs,
});

const mesh = new THREE.Mesh( new THREE.SphereGeometry( 0.75, 32, 16 ), material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
resize(true);
requestAnimationFrame(render);

function resize(force) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (force || canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

function render(time) {
  time *= 0.001;  // seconds
  
  resize();
  
  uniforms.sunDirection.value.x = Math.sin(time);
  uniforms.sunDirection.value.y = Math.cos(time);

  // Note: Since the earth is at 0,0,0 you can set the normal for the sun
  // with
  //
  // uniforms.sunDirection.value.copy(sunPosition);
  // uniforms.sunDirection.value.normalize();


  mesh.rotation.y = time * .3
  mesh.rotation.x = time * .7;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}