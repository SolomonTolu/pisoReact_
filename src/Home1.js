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

// useImageUpload.js

export function useImageUpload() {
  const [files, setFiles] = useState([]);  // <--- Change this line
  const [activePage, setActivePage] = useState(0);  // <--- Add this line
  // const [offScreenCanvas, setOffScreenCanvas] = useState(null);
  const [offScreenCanvasOriginalWidth, setOffScreenCanvasOriginalWidth] = useState(null);
  const [offScreenCanvasOriginalHeight, setOffScreenCanvasOriginalHeight] = useState(null);
  const [offScreenCanvases, setOffScreenCanvases] = useState([]);

  const canvasRef = useRef(null);

  // ...rest of the code for handling image upload and rendering...
  function changeMade(event) {
    const newFile = event.target.files[0];
    // 
    if (!newFile) {
      return;  // exit the function if no file selected
    }

    // setFiles(newFile);
    setFiles(prevFiles => [...prevFiles, newFile]);  // Append new file to array
    setActivePage(files.length);  // Set active page to the newly added one

    const fileUrl = URL.createObjectURL(newFile);
    const img = new Image();

    img.onload = function () {
      const offCanvas = document.createElement('canvas');

      // Store original dimensions
      const offScreenCanvasOriginalWidth = img.width;
      const offScreenCanvasOriginalHeight = img.height;

      console.log("offScreenCanvasOriginalWidth:" + offScreenCanvasOriginalWidth)
      console.log("offScreenCanvasOriginalHeight:" + offScreenCanvasOriginalHeight)

      // Calculate the scale factor to fit the image within the canvas
      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;

      // Calculate the scale factor to fit the image within the canvas
      const scaleFactor = Math.min(
        canvasWidth / img.width,
        canvasHeight / img.height
      ) * 4.5;

      // Calculate the new dimensions with the scale factor
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;

      offCanvas.width = scaledWidth;
      offCanvas.height = scaledHeight;

      setOffScreenCanvasOriginalWidth(offScreenCanvasOriginalWidth);
      setOffScreenCanvasOriginalHeight(offScreenCanvasOriginalHeight);


      // offCanvas.width = img.width;
      // offCanvas.height = img.height;
      offCanvas.getContext('2d').drawImage(img, 0, 0, scaledWidth, scaledHeight);
      // setOffScreenCanvas(offCanvas);
      setOffScreenCanvases(prevCanvases => [...prevCanvases, offCanvas]);

    };

    img.src = fileUrl;
  }

  // 


  // return { file, canvasRef, changeMade, offScreenCanvas };
  return {
    files, canvasRef, changeMade, offScreenCanvases, activePage, setActivePage,
    offScreenCanvasOriginalWidth, // Add these two variables
    offScreenCanvasOriginalHeight // Add these two variables
  };  // Return files array, activePage and setActivePage

}





export default function usePins(pins, setPins, canvasRef, scale, translateX, translateY, offsetX, offsetY, draggingStarted, offScreenCanvases, activePage, offScreenCanvasOriginalWidth, offScreenCanvasOriginalHeight) {
  // const [pins, setPins] = useState([]);
  const isPinClicked = useRef(false);
  const [selectedPin, setSelectedPin] = useState(null);


  useEffect(() => {

    const canvas = canvasRef.current;



    const addPin = (event) => {

      const offScreenCanvas = offScreenCanvases[activePage];

      if (draggingStarted.current) return; // Prevent pin creation if dragging has started
      if (!isPinClicked.current) {
        const rect = canvas.getBoundingClientRect();
        // take into account both panning and scaling
        const x = ((event.clientX - rect.left - translateX) / scale) - offsetX;
        const y = ((event.clientY - rect.top - translateY) / scale) - offsetY;


        console.log({
          x, y
        })
        console.log("canvas.width " + canvas.width)
        console.log("canvas.height " + canvas.height)
        console.log("offScreenCanvas.width: " + offScreenCanvas.width)
        console.log("offScreenCanvas.height: " + offScreenCanvas.height)
        console.log("scale " + scale)
        console.log("translateX " + translateX)
        console.log("translateY " + translateY)
        console.log("offsetX " + offsetX)

        const imageLeft = (canvas.width / 2) - (offScreenCanvas.width * scale / 2) + translateX;
        const imageRight = imageLeft + offScreenCanvas.width * scale;
        const imageTop = (canvas.height / 2) - (offScreenCanvas.height * scale / 2) + translateY;
        const imageBottom = imageTop + offScreenCanvas.height * scale;

        console.log({
          imageLeft, imageRight, imageTop, imageBottom
        })
        // Check if the pin's coordinates are within the image's bounds
        // if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
        if (x >= 0 && x <= offScreenCanvasOriginalWidth && y >= 0 && y <= offScreenCanvasOriginalHeight) {
          // Create the new pin with x and y coordinates and other details filled out
          const newPin = createNewPin(x, y);
          // Add the new pin to the list of pins
          setPins([...pins, newPin]);
          setSelectedPin(newPin);
        }
      } else {
        isPinClicked.current = false;
      }
    };

    const clickPin = (event) => {
      // ... same as before ...

      const rect = canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) - translateX - offsetX * scale) / scale;
      const y = ((event.clientY - rect.top) - translateY - offsetY * scale) / scale;

      for (let pin of pins) {
        // 
        // Check if the click is within the rectangular area occupied by the pin
        if (x >= pin.x && x <= pin.x + pin.width && y >= pin.y && y <= pin.y + pin.height) {
          // event.stopPropagation();  // Stop the event propagation
          ;
          if (event.shiftKey) {
            // If the shift key is being pressed, remove the pin
            setPins(prevPins => prevPins.filter(p => p.id !== pin.id));
            // Also, if the deleted pin was selected, deselect it
            if (selectedPin && pin.id === selectedPin.id) {
              setSelectedPin(null);
            }

          } else {
            isPinClicked.current = true;
            // Otherwise, set this pin as the selected pin
            setSelectedPin(pin);
          }

          break;
        }
      }
    };

    canvas?.addEventListener('click', clickPin);
    canvas?.addEventListener('click', addPin);

    return () => {
      canvas?.removeEventListener('click', clickPin);
      canvas?.removeEventListener('click', addPin);
    }
  }, [canvasRef, scale, translateX, translateY, offsetX, offsetY, pins, draggingStarted, offScreenCanvases, activePage, offScreenCanvasOriginalWidth, offScreenCanvasOriginalHeight]);

  function createNewPin(x, y) {
    const selectedImage = getRandomImage();

    return {
      id: Math.random(),
      title: "Untitled",
      comments: [],
      x: x,
      y: y,
      width: 25,
      height: 35,
      image: { src: selectedImage, name: "Name" },
      color: "red",
      description: ``,
      saved: false,
      createdBy: "Living",
      created: new Date(),
      updated: new Date(),
      updatedBy: "Living",
    };
  }



  function getRandomImage() {
    const images = ["arup.jpg", "charlotte.jpg", "arup2.jpg"]
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }


  return {
    selectedPin,
    setSelectedPin,
  };
}



import pin from '../pin-image.png'

const useZoomAndPan = (canvasRef, offScreenCanvases, activePage, scale, setScale, translateX, setTranslateX, translateY, setTranslateY, offsetX, setOffsetX, offsetY, setOffsetY, panelsVisible, toolbarVisible, pins, draggingStarted) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const initialPosition = useRef({ x: 0, y: 0 });
  const pinImg = useRef(new Image());

  const dragThreshold = 5;
  // Setup the pin image
  useEffect(() => {
    pinImg.current.src = pin;
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    var context;
    const offScreenCanvas = offScreenCanvases[activePage];

    function handleResize() {
      if (canvas && offScreenCanvas) {
        // handle resize logic
        canvas.width = panelsVisible ? window.innerWidth - 480 : window.innerWidth;
        canvas.height = toolbarVisible ? window.innerHeight - 48 : window.innerHeight;
        context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Apply translations and scale
        context.translate(translateX, translateY);
        context.scale(scale, scale);


        // Draw the image centered
        const x = (canvas.width / 2) - (offScreenCanvas.width / 2); // center the image within the canvas. 
        const y = (canvas.height / 2) - (offScreenCanvas.height / 2); // center the image within the canvas. 
        context.drawImage(offScreenCanvas, x + offsetX, y + offsetY, offScreenCanvas.width, offScreenCanvas.height);


        for (let pin of pins) {
          context.drawImage(pinImg.current, pin.x + offsetX, pin.y + offsetY, pin.width, pin.height);
        }

        // Reset transformations
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
    }

    // handleKeyDown, zoom, handleMouseDown, handleMouseUp, and handleMouseMove functions goes here
    //Zooming in and out
    const zoom = (event) => {
      event.preventDefault(); // prevent the default scroll behaviour

      let rect = canvas.getBoundingClientRect(); // get the bounding rectangle of the canvas

      let x = event.clientX - rect.left; // adjust the x position to be relative to the canvas
      let y = event.clientY - rect.top; // adjust the y position to be relative to the canvas




      const oldScale = scale;


      let newScale;
      if (event.deltaY > 0) {
        newScale = Math.max(scale * 0.9, 0.2); // limit zoom out
      } else if (event.deltaY < 0) {
        newScale = Math.min(scale * 1.1, 4); // limit zoom in
      }

      // calculate the new translation after zooming
      const newtranslateX = x - (x - translateX) * (newScale / oldScale);
      const newtranslateY = y - (y - translateY) * (newScale / oldScale);

      setScale(newScale);
      setTranslateX(newtranslateX);
      setTranslateY(newtranslateY);

      // //

      // // trigger the handleResize function to redraw with the new scale
      handleResize();
    };
    const handleMouseDown = (event) => {
      //
      draggingStarted.current = false; // Reset on each mouse down
      setIsDragging(true);
      initialPosition.current = { x: event.clientX, y: event.clientY }; // Store initial position on mouse down
      setLastPosition({ x: event.clientX, y: event.clientY });
    }

    const handleMouseUp = () => {
      //
      if (draggingStarted.current) {
        document.body.style.cursor = 'default'; // Reset cursor if dragging has started
      }
      setIsDragging(false);
      initialPosition.current = { x: 0, y: 0 };// Reset initial position


    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        // Only start dragging if mouse has moved beyond threshold
        const dx = event.clientX - initialPosition.current.x;
        const dy = event.clientY - initialPosition.current.y;

        if (Math.abs(dx) >= dragThreshold || Math.abs(dy) >= dragThreshold) {
          draggingStarted.current = true; // Dragging started

          document.body.style.cursor = 'move'; // Change cursor to 'move' when dragging

          const deltaX = event.clientX - lastPosition.x;
          const deltaY = event.clientY - lastPosition.y;

          setOffsetX(offsetX + deltaX);
          setOffsetY(offsetY + deltaY);
          setLastPosition({ x: event.clientX, y: event.clientY });
        }
      } else {
        // Not dragging, so check if the cursor is over a pin
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) - translateX - offsetX * scale) / scale;
        const y = ((event.clientY - rect.top) - translateY - offsetY * scale) / scale;
        const overPin = pins.some(pin => x >= pin.x && x <= pin.x + pin.width && y >= pin.y && y <= pin.y + pin.height);
        document.body.style.cursor = overPin ? 'pointer' : 'default'; // Change cursor to 'pointer' if over a pin
      }
    }

    window.addEventListener('resize', handleResize);
    canvas?.addEventListener('wheel', zoom);
    canvas?.addEventListener('mousedown', handleMouseDown);
    canvas?.addEventListener('mouseup', handleMouseUp);
    canvas?.addEventListener('mousemove', handleMouseMove);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas?.removeEventListener('wheel', zoom);
      canvas?.removeEventListener('mousedown', handleMouseDown);
      canvas?.removeEventListener('mouseup', handleMouseUp);
      canvas?.removeEventListener('mousemove', handleMouseMove);
    }
  }, [offScreenCanvases, activePage, panelsVisible, toolbarVisible, canvasRef, scale, translateX, translateY, offsetX, offsetY, isDragging, lastPosition, pins, draggingStarted]);

  return {
    isDragging,
    setIsDragging,
    lastPosition,
    setLastPosition,
    initialPosition,
  }
};

export default useZoomAndPan;


// const Pin = {
//   id: number || string,
//    title: text,
//   comments:[Array], //array of comment, each comment will be: comment {comment:string,user:string}
//   X:number,
//   Y:number,
//   Width:number,
//   Height:number,
//   Image:string ,
//   Color:string,
//   description:string ,
//   Saved: boolean,// default false
//   createdBy:string,
//   created:Date,
//   UpdatedBy:Date,
//   }