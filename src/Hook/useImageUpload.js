import { useState, useEffect, useRef } from 'react';

export function useImageUpload() {
    const [files, setFiles] = useState([]);  // <--- Change this line
    const [activePage, setActivePage] = useState(0);  // <--- Add this line
    // const [offScreenCanvas, setOffScreenCanvas] = useState(null);
    const [offScreenCanvasOriginalWidth, setOffScreenCanvasOriginalWidth] = useState(null);
    const [offScreenCanvasOriginalHeight, setOffScreenCanvasOriginalHeight] = useState(null);
    const [offScreenCanvases, setOffScreenCanvases] = useState([]);

    var chosenScaleFactor = useRef(0);;

    var canvasRef = useRef(null);

    // ...rest of the code for handling image upload and rendering...
    function changeMade(event) {
        const newFile = event.target.files[0];
        // 
        console.log("chosenScaleFactor " + chosenScaleFactor.current)
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

            console.log(canvasRef)
            console.log("offScreenCanvasOriginalWidth:" + offScreenCanvasOriginalWidth)
            console.log("offScreenCanvasOriginalHeight:" + offScreenCanvasOriginalHeight)

            // Calculate the scale factor to fit the image within the canvas
            const canvasWidth = canvasRef.current.width;
            const canvasHeight = canvasRef.current.height;

            console.log(canvasWidth)
            console.log(canvasHeight)

            // Calculate the scale factor to fit the image within the canvas
            const scaleFactor = Math.min(
                canvasWidth / img.width,
                canvasHeight / img.height
            ) * 4.5;

            if (!chosenScaleFactor.current) {
                console.log("There is no chosenScaleFactor ")
                chosenScaleFactor.current = scaleFactor
            }

            // Calculate the new dimensions with the scale factor
            const scaledWidth = img.width * chosenScaleFactor.current;
            const scaledHeight = img.height * chosenScaleFactor.current;

            offCanvas.width = scaledWidth;
            offCanvas.height = scaledHeight;
            console.log("scaleFactor:" + scaleFactor)

            console.log("scaledWidth:" + scaledWidth)
            console.log("scaledHeight:" + scaledHeight)

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

export default useImageUpload;
