import { useState, useEffect, useRef } from 'react';

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

        console.log(offScreenCanvases)
        const offScreenCanvas = offScreenCanvases[activePage];

        console.log(offScreenCanvas)

        function handleResize() {
            if (canvas && offScreenCanvas) {
                console.log(canvas.width)
                console.log(canvas.height)
                // handle resize logic
                // canvas.width = panelsVisible ? window.innerWidth - 480 : window.innerWidth;
                // canvas.height = toolbarVisible ? window.innerHeight - 48 : window.innerHeight;


                canvas.width = window.innerWidth - 480;
                canvas.height = window.innerHeight - 48;

                context = canvas.getContext('2d');

                context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

                console.log("scale " + scale)
                // Apply translations and scale
                context.translate(translateX, translateY);
                context.scale(scale, scale);

                console.log(offScreenCanvas.width, offScreenCanvas.height)


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
                console.log({
                    x, y
                })

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

