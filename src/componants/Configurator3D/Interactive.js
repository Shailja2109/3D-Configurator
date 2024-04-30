import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

const Interactive = ({ url }) => {
    const group = useRef();
    const [selectedPart, setSelectedPart] = useState(null);

    const gltf = useGLTF(url);
    const handleClick = (event) => {
            setSelectedPart(event.object);
    };

    useFrame(() => {
        if (selectedPart) {
            selectedPart.material.transparent = true;
            selectedPart.material.opacity = 0.25
        }
    });

    return (
        <group ref={group}>
            <primitive object={gltf.scene} onClick={handleClick} />
        </group>
    );
};

export default Interactive;
