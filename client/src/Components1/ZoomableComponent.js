import React, { useState } from 'react';
import {
    Descriptions,
    Button, Tabs,
    Upload
} from 'antd';
import './style.css'
const ZoomableComponent = () => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed((prevState) => !prevState);
    };

    return (
        <div >
            {/* Nội dung của component, ví dụ: */}
            {/* <img src="path_to_image.jpg" alt="Zoomable Image" /> */}
            <Button className={`zoomable-component ${isZoomed ? 'zoomed' : ''}`} onClick={handleClick}>Duy</Button>
        </div>
    );
};

export default ZoomableComponent;
