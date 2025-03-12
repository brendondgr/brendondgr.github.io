import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Add axes helper
export function addAxesHelper(scene) {
    const axesHelper = new THREE.AxesHelper(5);
    
    // Set axis colors
    axesHelper.material.color.setRGB(1, 0, 0); // X-Axis: Red
    axesHelper.material.color.setRGB(0, 1, 0); // Y-Axis: Green
    axesHelper.material.color.setRGB(0, 0, 1); // Z-Axis: Blue
    
    scene.add(axesHelper);
}