import React from "react";
import { useState } from "react";
const AddPlant = () => {
    const [devices, setDevices] = useState([]);

    const handleDevices = (event) => {
        setDevices(devices + event.target.value)
    }
    
    return (

    )
}

export default AddPlant;