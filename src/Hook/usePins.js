import { useState, useEffect, useRef } from 'react';

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

            console.log({
                x, y
            })

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
