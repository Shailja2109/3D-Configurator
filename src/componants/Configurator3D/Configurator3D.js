import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, OrbitControls, useGLTFLoader } from '@react-three/drei'
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Interactive from './Interactive.js';


const Skybox = ({ textureUrl }) => {
  const texture = useLoader(TextureLoader, textureUrl ? textureUrl : "https://images.pexels.com/photos/7078634/pexels-photo-7078634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
  return (
    <mesh>
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial side={THREE.DoubleSide} map={texture} opacity={0.5} transparent={true} />
    </mesh>
  );
};

const LoadObject = ((props) => {
  console.log(props)
  const nodes = useLoader(OBJLoader, props.props.modelFile.Url)
  const [selectedPart, setSelectedPart] = useState(null);
  const [center, setCenter] = useState(new THREE.Vector3(0, 0, 0))
  let materialList = {}

  const handleClick = (event) => {
    setSelectedPart(event.object);

    if (selectedPart) {
      if (selectedPart.material.transparent === true) {
        selectedPart.material.transparent = false;
        selectedPart.material.opacity = 1
      } else {
        selectedPart.material.transparent = true;
        selectedPart.material.opacity = 0.5
      }
    }
  };

  useEffect(() => {
    // const box = new THREE.Box3()
    // box.setFromObject(nodes.scene);
    // var boxcenter = new THREE.Vector3()
    // box.getCenter(boxcenter)
    // setCenter(boxcenter)

    nodes.traverse(function (object) {
      console.log(object)
      if (object.material) {
        materialList = Object.assign({}, ...object.material.map(card => ({ [card.name]: card })))
      }
    });
    props.props.onSetMaterials(materialList)
  }, [])

  if (materialList.length > 0 && props.props.controls.Material != null) {
    materialList[props.props.controls.Material]?.color.set(props.props.controls.Color)
  }

  const boxRef = useRef();
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += props.props.controls.AnimationValue > 0 ? props.props.controls.AnimationValue : 0;
    }
  });

  return <primitive
    object={nodes}
    ref={boxRef}
    onClick={handleClick}
    scale={[props.props.controls.Scale / 100, props.props.controls.Scale / 100, props.props.controls.Scale / 100]}
    position={[0 - center.x, 0 - center.y, 0 - center.z]}
    rotation={[0, 0, 0]}
  />
})

const LoadGltf = ((props) => {
  const nodes = useGLTF(props.modelFile.Url)
  const [selectedPart, setSelectedPart] = useState(null);
  const [center, setCenter] = useState(new THREE.Vector3(0, 0, 0))

  const handleClick = (event) => {
    setSelectedPart(event.object);

    if (selectedPart) {
      if (selectedPart.material.transparent === true) {
        selectedPart.material.transparent = false;
        selectedPart.material.opacity = 1
      } else {
        selectedPart.material.transparent = true;
        selectedPart.material.opacity = 0.5
      }
    }
  };

  if (props.controls.Material != null) {
    nodes.materials[props.controls.Material]?.color.set(props.controls.Color)
  }

  useEffect(() => {
    const box = new THREE.Box3()
    box.setFromObject(nodes.scene);
    var boxcenter = new THREE.Vector3()
    box.getCenter(boxcenter)
    setCenter(boxcenter)
    props.onSetMaterials(nodes.materials)
  }, [])

  const boxRef = useRef();
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.y += props.controls.AnimationValue > 0 ? props.controls.AnimationValue : 0;
    }
  });

  return <primitive
    object={nodes.scene}
    ref={boxRef}
    onClick={handleClick}
    scale={[props.controls.Scale / (100), props.controls.Scale / (100), props.controls.Scale / (100)]}
    position={[0 - center.x, 0 - center.y, 0 - center.z]}
    rotation={[0, 0, 0]}
  />
})

const Configurator3D = (props) => {

  return (<>
    {props.modelFile.Extension === 'obj' ? LoadObject({ props }) : LoadGltf(props)}
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