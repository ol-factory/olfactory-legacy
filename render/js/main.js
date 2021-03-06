var hero = {
  scene: null,
  camera: null,
  renderer: null,
  container: null,
  controls: null,
  clock: null,
  stats: null,

  init: function() { // Initialization

    // create main scene
    this.scene = new THREE.Scene();

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    // prepare camera
    var VIEW_ANGLE = 40, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 2000;
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, -60);
    this.camera.lookAt(new THREE.Vector3(0,0,0));

    // prepare renderer
    this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;

    // prepare container
    this.container = document.createElement('div');
    this.container.setAttribute("class", "render");
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    // events
    THREEx.WindowResize(this.renderer, this.camera);

    // prepare controls (OrbitControls)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);
    this.controls.minDistance = 40;
    this.controls.maxDistance = 40;

    // prepare clock
    this.clock = new THREE.Clock();

    // prepare stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '50px';
    this.stats.domElement.style.bottom = '50px';
    this.stats.domElement.style.zIndex = 1;
    this.container.appendChild( this.stats.domElement );

    // add spot light
    var spLight = new THREE.SpotLight(0xffffff, 1.5, 1000, Math.PI / 3);
    spLight.castShadow = true;

    spLight.position.set(20, 50, -100);
    this.scene.add(spLight);

    // add second spot light
    var spLight2 = new THREE.SpotLight(0xffffff, .3, 1000, Math.PI / 3);
    spLight2.castShadow = true;

    spLight2.position.set(20, 50, 100);
    this.scene.add(spLight2);

    // add simple ground
//     var ground = new THREE.Mesh( new THREE.PlaneGeometry(200, 200, 10, 10), new THREE.MeshLambertMaterial({color:0xffffff}) );
//     ground.receiveShadow = true;
//     ground.position.set(0, -10, 0);
//     ground.rotation.x = -Math.PI / 2;
//     this.scene.add(ground);

    // load a model
    this.loadModel();
  },
  loadModel: function() {

      loader = new THREE.ColladaLoader();
      loader.load( './models/mask_lq.dae', function ( collada ) {
				dae = collada.scene;
				dae.traverse( function ( child ) {
					if ( child instanceof THREE.SkinnedMesh ) {
						var animation = new THREE.Animation( child, child.geometry.animation );
						animation.play();
					}
				} );
				dae.scale.x = dae.scale.y = dae.scale.z = .35;
            dae.position.x = 0;
  dae.position.y = -8;
  dae.position.z = 0;
          dae.rotateX(17);
				dae.updateMatrix();
          hero.scene.add(dae);
			} );

  }
};

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

// Update controls and stats
function update() {
  hero.controls.update(hero.clock.getDelta());
  hero.stats.update();
}

var rotation = true;

function rotate() {
    var timer = Date.now() * 0.0005;

    hero.camera.position.x = Math.cos( timer ) * 40;
    hero.camera.position.z = Math.sin( timer ) * 40;
    hero.camera.lookAt( hero.scene.position );
}

// Render the scene
function render() {
  if (hero.renderer) {

    if (rotation) { rotate(); }

    hero.renderer.render(hero.scene, hero.camera);
  }
}

// Initialize lesson on page load
function initializeLesson() {
  hero.init();
  animate();
}

if (Modernizr.webgl && Modernizr.canvas) {
    console.log("supported");
    if (window.addEventListener) {
        window.addEventListener('load', initializeLesson, false);
        window.addEventListener('click', function() {
            rotation = false;
        }, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', initializeLesson);
    } else {
        window.onload = initializeLesson;
    }
} else {
    console.log("not supported");
    var notSupported = document.createElement("div");
    notSupported.setAttribute("class", "notSupported");
    notSupported.style.cssText = "text-align: center;";
    document.body.appendChild(notSupported);
}
