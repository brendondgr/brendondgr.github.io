// Three.js script for 3D metallic text "Brendon DGR"

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Three.js');
  
  // Load Three.js and required modules dynamically
    Promise.all([
        import('https://cdn.skypack.dev/three@0.136.0'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js'),
        import('./javascript/create_text.js'),
        import('./javascript/reference_axis.js')
    ]).then(([THREE, { OrbitControls }, { FontLoader }, { TextGeometry }, { createText }, { addAxesHelper }]) => {

    // -------------------------------------------------------------------------------------------- //
    // --                             THREE.JS CONTENT GOES HERE                                 -- //
    // -------------------------------------------------------------------------------------------- //
    // -------------------------------------------------------------------------------------------- //
    console.log('Three.js modules loaded successfully');
    
    // Initialize the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark background
    
    // Set up camera
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -10 * aspect, 10 * aspect, 10, -10, 0.1, 1000
    );
    camera.position.z = 15;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // Add orbit controls for navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lock rotation to Y-axis only
    controls.minPolarAngle = Math.PI / 2; // 90 degrees
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees
    controls.enableZoom = false; // Disable zooming
    controls.enablePan = false; // Disable panning
    
    // Add lighting
    function addLighting(scene) {
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Add point lights for more dramatic lighting
      const pointLight1 = new THREE.PointLight(0x0088ff, 1, 100);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0xff8800, 1, 100);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function createAnimationLoop(textCoordinates) {
        const {dgrBottomRight, brendonBottomLeft} = textCoordinates;
        
        // Create objects outside the animation loop
        const whiteCube = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 1,
                metalness: 0,
                transparent: true
            })
        );
        scene.add(whiteCube);
        
        // Create a line material
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 10 });
        
        // Create a geometry to hold the line vertices
        const lineGeometry = new THREE.BufferGeometry();
        const lineVertices = new Float32Array([dgrBottomRight.x, dgrBottomRight.y, dgrBottomRight.z]);
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
        
        // Create the line and add it to the scene
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        
        // Set initial position
        whiteCube.position.set(dgrBottomRight.x+3.7, dgrBottomRight.y, dgrBottomRight.z);
        
        // Define the animation function
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            
            // Animate the Cube going from dgrBottomRight to brendonBottomLeft
            const lerpFactor = 0.05;
            whiteCube.position.lerp(brendonBottomLeft, lerpFactor);
            
            // Update line vertices to leave a trail
            const positions = line.geometry.attributes.position.array;
            const newPositions = new Float32Array(positions.length + 3);
            newPositions.set(positions);
            newPositions[positions.length] = whiteCube.position.x;
            newPositions[positions.length + 1] = whiteCube.position.y;
            newPositions[positions.length + 2] = whiteCube.position.z;
            
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

            // Calculate distance to target
            const distanceToTarget = whiteCube.position.distanceTo(brendonBottomLeft);
            
            // Only start fading when we're very close to the target (threshold of 0.1 units)
            if (distanceToTarget < 0.1) {
                if (whiteCube.material.opacity > 0) {
                    whiteCube.material.opacity -= 0.02;
                } else if (whiteCube.parent) {
                    scene.remove(whiteCube);
                    // scene.remove(line);
                }
            }
            
            renderer.render(scene, camera);
        }
        
        return animate;
    }
    
    // Initialize the scene
    // addAxesHelper(scene);
    addLighting(scene);
    
    // Handle text creation asynchronously
    createText(scene)
      .then(textCoordinates => {
        console.log('Text coordinates received:', textCoordinates);
        // Start animation after text is created
        const animate = createAnimationLoop(textCoordinates);
        animate();
        // addAxesHelper(scene);
      })
      .catch(error => {
        console.error('Error creating text:', error);
      });
    
  }).catch(error => {
    console.error('Error loading Three.js modules:', error);
  });
});

