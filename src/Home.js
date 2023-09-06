import React, { useState, useRef, useEffect } from 'react';
import { ToolBar } from './components/ToolBar';
import { RightPanel } from './components/RightPanel';
import { LeftPanel } from './components/LeftPanel';
import useImageUpload from './Hook/useImageUpload';
import usePins from './Hook/usePins';
import useZoomAndPan from './Hook/useZoomAndPan';
import Canvas from './components/Canvas'; // Import the new Canvas component

function Home() {
  const { files, canvasRef, changeMade, offScreenCanvases, activePage, setActivePage, offScreenCanvasOriginalWidth, offScreenCanvasOriginalHeight } = useImageUpload();
  const [panelsVisible, setPanelsVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  //Zooming in and out
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  //Panning;
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const draggingStarted = useRef(false);

  // Pin
  const [pins, setPins] = useState([]);
  const { selectedPin, setSelectedPin, } = usePins(pins, setPins, canvasRef, scale, translateX, translateY, offsetX, offsetY, draggingStarted, offScreenCanvases, activePage, offScreenCanvasOriginalWidth, offScreenCanvasOriginalHeight);

  const {
    isDragging,
    setIsDragging,
    lastPosition,
    setLastPosition,
    initialPosition,
  } = useZoomAndPan(canvasRef, offScreenCanvases, activePage, scale, setScale, translateX, setTranslateX, translateY, setTranslateY, offsetX, setOffsetX, offsetY, setOffsetY, panelsVisible, toolbarVisible, pins, draggingStarted, offScreenCanvasOriginalWidth, offScreenCanvasOriginalHeight);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "\\") {
        setPanelsVisible(prevState => !prevState);
        setToolbarVisible(prevState => !prevState);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

    }
  }, []);

  return (
    <div className='planSection'>
      <ToolBar visible={toolbarVisible} />
      <RightPanel visible={panelsVisible} selectedPin={selectedPin} setSelectedPin={setSelectedPin} pins={pins} setPins={setPins} />
      <LeftPanel
        visible={panelsVisible}
        fileUploaded={changeMade}
        files={files} setActivePage={setActivePage}

      />
      <Canvas
        canvasRef={canvasRef}
        file={files[activePage]}
        offScreenCanvas={offScreenCanvases[activePage]}
        panelsVisible={panelsVisible}
        toolbarVisible={toolbarVisible}
        scale={scale}
        translateX={translateX}
        translateY={translateY}
        offsetX={offsetX}
        offsetY={offsetY}
        isDragging={isDragging}
        lastPosition={lastPosition}
        pins={pins}
      />
    </div>
  );
}
export default Home;