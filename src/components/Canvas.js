// Canvas.js
import React, { useEffect } from 'react';
const Canvas = ({
    canvasRef,
    file,
    offScreenCanvas,
    panelsVisible,
    toolbarVisible,
    scale,
    translateX,
    translateY,
    offsetX,
    offsetY,
    isDragging,
    lastPosition,
    pins
}) => {

    useEffect(() => {
        // console.log('canvasRef:', canvasRef); // log the canvasRef
        // console.log('offScreenCanvas:', offScreenCanvas); // log the canvasRef
        return () => { }
    }, [offScreenCanvas, panelsVisible, toolbarVisible, canvasRef, scale, translateX
        , translateY, offsetX, offsetY, isDragging, lastPosition, pins]);
    return (
        file && <div className='canvasContainer'>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
export default Canvas;
