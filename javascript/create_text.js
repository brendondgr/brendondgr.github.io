import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { FontLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/TextGeometry.js';

export function createText(scene) {
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
