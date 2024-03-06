import React, { useEffect, useState } from 'react';
import Configurator3D from '../Configurator3D/Configurator3D.js';
import classes from './FileDrop.module.css';
import { ThreeDModelExtensions } from '../../Constants';
import { Canvas } from '@react-three/fiber'
import ControlPanel from '../ControlPannel/ControlPannel.js';

// Main Component to Load 3D Files
const FileDrop = () => {
    const [is3dFile, setIs3DFile] = useState(false);
    const [modelFile, setModelFile] = useState({})
    const [materials, setMaterials] = useState([])
    const [controls, setControls] = useState({})

    let dummyControls = {
        'Scale' : 250,
        'Color' : '#ffffff',
        'Skybox' : 'https://images.pexels.com/photos/7078634/pexels-photo-7078634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'Material' : null
    }

    // Functional Component to drag and drop personal 3D GLTF files
    const handleDrop = async (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        if (items.length === 1 && items[0].kind === 'file') {
            const item = items[0].webkitGetAsEntry();
            if (item.isFile) {
                const file = items[0].getAsFile();
                const fileExtenstion = file.name.split('.')[1];

                if (ThreeDModelExtensions.includes(fileExtenstion)) {
                    const reader = new FileReader();
                    const blob = new Blob([file]);
                    reader.readAsArrayBuffer(blob);
                    const url = URL.createObjectURL(blob);
                    setIs3DFile(true);
                    const newVariant = {
                        Id: Date.now(),
                        Url: url,
                    };
                    setModelFile(newVariant)
                    setControls(dummyControls)
                }
            } else if (item.isDirectory) {
                window.alert("Folder is uploaded,Please select only file.");
            }
        } else {
            window.alert("Please drop only a single file.");
        }
    };

    useEffect(() => {
        setModelFile(prevState => ({
            ...prevState,
            Materials: materials
        }))
    }, [materials])

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    return (
        <div
            className={classes.fileDropContainer}
            onDrop={handleDrop}
            onDragOver={handleDragOver} 
        >
            <p>3D Configurator</p>
            {is3dFile ?
                <div className={classes.Main}>
                    <div className={classes.Canvas3D} >
                        <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 5] }}>
                            {/* Adding Configurator for 3D Viewer */}
                            <Configurator3D modelFile={modelFile} onSetMaterials={setMaterials} controls={controls} />
                        </Canvas>
                        <p>3D Canvas</p>
                    </div>
                    <div className={classes.ControlPanel}>
                        {/* Adding Control Pannel to Manipulate 3D Model */}
                        <p>Control Panel</p>
                        <ControlPanel materials={materials} onSetControls={setControls}/>
                    </div>
                </div>
                : <div className={classes.ControlText}><p>Drag glTF 2.0</p></div>
            }
        </div>
    )
}
export default FileDrop;