import React, { useEffect, useState } from 'react';
import classes from './ControlPannel.module.css';
import { ColorPicker } from 'primereact/colorpicker';
import { HexColorPicker } from "react-colorful";

const ControlPanel = ({ materials, onSetControls }) => {
  const [color, setColor] = useState('#ffffff')
  const [scale, setScale] = useState(100)
  const [material, setMaterial] = useState('')
  const [skybox, setSkybox] = useState('')
  const [animationValue, setAnimationValue] = useState(0)
  const [selectedValue, setSelectedValue] = useState('');

  // Function to handle changes in the dropdown selection
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    setMaterial(event.target.value)
  };

  useEffect(() => {
    onSetControls(prevControls => ({
      ...prevControls,
      'Color': color
    }));
  }, [color])

  useEffect(() => {
    onSetControls(prevControls => ({
      ...prevControls,
      'Scale': scale
    }));
  }, [scale])

  useEffect(() => {
    onSetControls(prevControls => ({
      ...prevControls,
      'AnimationValue': animationValue
    }))
  }, [animationValue])

  useEffect(() => {
    onSetControls(prevControls => ({
      ...prevControls,
      'Material': material
    }));
  }, [material])

  const SetSkyboxControls = () => {
    useEffect(() => {
      onSetControls(prevControls => ({
        ...prevControls,
        'Skybox': skybox
      }));
    }, [skybox])
  }

  return (<>
    <div className={classes.Scale}>
      <p className={classes.ControlText}>Scale : </p>
      <input type="range" min={100} max={1000} defaultValue={100} onChange={(e) => { setScale(e.target.value) }} />
    </div>
    <div className={classes.Materials}>
      <p className={classes.ControlText}>Material : </p>
      <select id="dropdown" value={selectedValue} onChange={(e) => { handleSelectChange(e) }}>
        <option value="">-- Select --</option>
        {Object.keys(materials).map((matName, index) => (
          <>
            <option value={matName}>{index}: {matName}</option>
          </>
        ))}
      </select>
    </div>
    <div className={classes.Color}>
      <HexColorPicker color={color} onChange={setColor} />
    </div>
    <p className={classes.ControlText}> Skybox </p>
    <div className={classes.Skybox}>
      <input
        placeholder="https://"
        id={skybox}
        type="text"
        value={skybox}
        onChange={(e) => {
          setSkybox(e.target.value)
        }}
      />
      <button onClick={SetSkyboxControls()}>
        Submit
      </button>
    </div>
    <p className={classes.ControlText}> Animation </p>
    <div className={classes.Animation}>
      <button onClick={() => { setAnimationValue(0.001) }}>Start</button>
      <button onClick={() => { setAnimationValue(0) }}>Stop</button>
      <button onClick={() => { setAnimationValue(animationValue + 0.001) }}>+</button>
      <button onClick={() => { setAnimationValue(animationValue - 0.001) }}>-</button>
    </div>
  </>);
};

export default ControlPanel;