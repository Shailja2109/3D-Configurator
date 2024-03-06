import React, { useEffect, useState } from 'react';
import classes from './ControlPannel.module.css';
import { ColorPicker } from 'primereact/colorpicker';

const ControlPanel = ({ materials, onSetControls }) => {
  const [color, setColor] = useState('#ffffff')
  const [scale, setScale] = useState(250)
  const [material, setMaterial] = useState('')
  const [skybox, setSkybox] = useState('')

  useEffect(() => {
    onSetControls(prevControls => ({
      ...prevControls,
      'Color': '#' + color
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
    <p className={classes.ControlText}>Materials</p>
    <div className={classes.Materials}>
      {Object.keys(materials).map((matName, index) => (
        <>
          <button onClick={() => {
            setMaterial(matName)
          }}>
            <p>{matName}</p>
          </button>
        </>
      ))}
    </div>
    <p className={classes.ControlText}>Scale</p>
    <div className={classes.Scale}>
      <input type="range" min={100} max={1000} defaultValue={250} onChange={(e) => { setScale(e.target.value) }} />
    </div>
    <p className={classes.ControlText}>Color</p>
    <div className={classes.Color}>
      <ColorPicker format="hex" value={color} onChange={(e) => setColor(e.value)} inline />
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
  </>);
};

export default ControlPanel;