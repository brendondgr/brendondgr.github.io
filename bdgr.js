// Three.js script for 3D metallic text "Brendon DGR"

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Three.js');
  
  // Load Three.js and required modules dynamically
    Promise.all([
        import('https://cdn.skypack.dev/three@0.136.0'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js'),
        import('https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js')
    ]).then(([THREE, { OrbitControls }, { FontLoader }, { TextGeometry }]) => {

    // -------------------------------------------------------------------------------------------- //
    // --                             THREE.JS CONTENT GOES HERE                                 -- //
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
    
    // Add axes helper
    function addAxesHelper(scene) {
      const axesHelper = new THREE.AxesHelper(5);
      
      // Set axis colors
      axesHelper.material.color.setRGB(1, 0, 0); // X-Axis: Red
      axesHelper.material.color.setRGB(0, 1, 0); // Y-Axis: Green
      axesHelper.material.color.setRGB(0, 0, 1); // Z-Axis: Blue
      
      scene.add(axesHelper);
    }



    // Add the Text
    function createText() {
      console.log('Loading font...');
      const fontLoader = new FontLoader();
      
      return new Promise((resolve, reject) => {
        fontLoader.load('https://cdn.skypack.dev/three@0.136.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
          console.log('Font loaded successfully');
          
          // Create text geometry for "Brendon"
          const brendonGeometry = new TextGeometry('Brendon', {
            font: font,
            size: 2,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 1
          });

          // Create text geometry for "DGR"
          const dgrGeometry = new TextGeometry('DGR', {
            font: font,
            size: 2,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 1
          });

          // Center the geometries
          brendonGeometry.computeBoundingBox();
          dgrGeometry.computeBoundingBox();

          const brendonWidth = brendonGeometry.boundingBox.max.x - brendonGeometry.boundingBox.min.x;
          const dgrWidth = dgrGeometry.boundingBox.max.x - dgrGeometry.boundingBox.min.x;

          // Print both brendonWidth and dgrWidth
          console.log('Brendon width:', brendonWidth);
          console.log('DGR width:', dgrWidth);

          const extra_width = 0.5;

          const total_width = brendonWidth + dgrWidth + extra_width;
          const center = total_width / 2;

          // Create metallic material for "Brendon"
          const brendonMaterial = new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            metalness: 0,
            roughness: 0.7,
            envMapIntensity: 0.2
          });

          // Create metallic material for "DGR" with a lightish-blue tone
          const dgrMaterial = new THREE.MeshStandardMaterial({
            color: 0x88ccee,
            metalness: 0,
            roughness: 0.7,
            envMapIntensity: 0.2
          });

          // Create the text meshes and add them to the scene
          const brendonMesh = new THREE.Mesh(brendonGeometry, brendonMaterial);
          const dgrMesh = new THREE.Mesh(dgrGeometry, dgrMaterial);

          scene.add(brendonMesh);
          scene.add(dgrMesh);
          
          // Position "Brendon" at its starting position
          brendonMesh.position.x = -center - (extra_width/2);

          // Position "DGR" to the right of "Brendon"
          dgrMesh.position.x = (brendonWidth-center) + (extra_width/2);

          // Add environment map for reflections
          const cubeTextureLoader = new THREE.CubeTextureLoader();
          const envMap = cubeTextureLoader.load([
            'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
            'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
            'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
            'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
            'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
            'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg'
          ]);
          
          scene.environment = envMap;
          brendonMaterial.envMap = envMap;
          dgrMaterial.envMap = envMap;

          // Get the bottom-right corner of the dgr text, and then also get the bottom-left corner of the brendon text
          const dgrBottomRight = new THREE.Vector3(dgrMesh.position.x + dgrWidth/2, dgrMesh.position.y - dgrGeometry.boundingBox.min.y, dgrMesh.position.z);
          const brendonBottomLeft = new THREE.Vector3(brendonMesh.position.x - brendonGeometry.boundingBox.min.x, brendonMesh.position.y - brendonGeometry.boundingBox.min.y, brendonMesh.position.z);

          // Subtract base_value from the y-position of each.
          const base_value = 0.5;
          dgrBottomRight.y -= base_value;
          brendonBottomLeft.y -= base_value;
          
          console.log('Text created successfully!');

          // Resolve the promise with the coordinates
          resolve({dgrBottomRight, brendonBottomLeft});
        }, 
        // onProgress callback
        (xhr) => {
            console.log(`Font loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        // onError callback
        (error) => {
            console.error('Error loading font:', error);
            reject(error);
        });
      });
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
                } else {
                    scene.remove(whiteCube);
                    scene.remove(line);
                    return;
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
    createText()
      .then(textCoordinates => {
        console.log('Text coordinates received:', textCoordinates);
        // Start animation after text is created
        const animate = createAnimationLoop(textCoordinates);
        animate();
      })
      .catch(error => {
        console.error('Error creating text:', error);
      });
    
  }).catch(error => {
    console.error('Error loading Three.js modules:', error);
  });
});

