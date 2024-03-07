import React, { useEffect, useRef } from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei'
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

const Skybox = ({ textureUrl }) => {
  const texture = useLoader(TextureLoader, textureUrl ? textureUrl : "https://images.pexels.com/photos/7078634/pexels-photo-7078634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  return (
    <mesh>
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial side={THREE.DoubleSide} map={texture} opacity={0.5} transparent={true} />
    </mesh>
  );
};

const Configurator3D = (props) => {
  const nodes = useGLTF(props.modelFile.Url)
  const objectRef = useRef();

  if (props.controls.Material != null) {
    nodes.materials[props.controls.Material]?.color.set(props.controls.Color)
  }

  useEffect(() => {
    props.onSetMaterials(nodes.materials)
  }, [])

  return (<>
    <primitive
      ref={objectRef}
      object={nodes.scene}
      scale={[props.controls.Scale / 100, props.controls.Scale / 100, props.controls.Scale / 100]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
    <ambientLight intensity={0.5} />
    <pointLight intensity={0.5} position={[0, -1, 0]} />
    <pointLight intensity={0.5} position={[0, 1, 0]} />
    <spotLight position={[0, 5, 0]} intensity={0.5} angle={2 * Math.PI} penumbra={0.05} />
    <OrbitControls
      enablePan={true}
      minDistance={1}
      maxDistance={30}
      makeDefault dampingFactor={0.2} />
    <Skybox textureUrl={props.controls.Skybox} />
  </>
  );
};

export default Configurator3D;