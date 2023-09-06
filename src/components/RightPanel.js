import React, { useState, useRef } from 'react'
import Modal from './Modal';

export const RightPanel = ({ visible, selectedPin, setSelectedPin, pins, setPins }) => {

    const [comment, setComment] = useState("");
    const loggedInUser = "Living"; // Replace this with actual logged in username

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");  // either 'edit' or 'add'
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadedImage, setUploadedImage] = useState("");
    const [fileLabel, setFileLabel] = useState("Update Thumbnail Image");
    const fileInputRef = useRef(null);
    function editPinDetails() {
        setTitle(selectedPin.title);          // set the title from selectedPin
        setDescription(selectedPin.description);  // set the description from selectedPin
        setUploadedImage(selectedPin.image.src);  // set the image from selectedPin
        setModalType("edit");                // set the modal type to "edit"
        setModalOpen(true);                 // open the modal
    }
    function addComment(e) {
        e.preventDefault(); // prevent page refresh on form submit
        setModalType("add");
        setModalOpen(true);
    }
    const handleAddComment = (e) => {
        e.preventDefault();

        const newComment = {
            user: loggedInUser,
            comment: comment, // Assuming you're storing the comment value from the textarea in this state.
            created: new Date(),
            id: Math.random(), // Remember, in a real app you'd use a more reliable method to generate unique ids.
        };



        const pinIndex = pins.findIndex((pin) => pin.id === selectedPin.id);
        if (pinIndex >= 0) {
            const updatedPin = { ...pins[pinIndex] };
            updatedPin.comments.push(newComment);

            const updatedPins = [...pins];
            updatedPins[pinIndex] = updatedPin;


            setPins(updatedPins);
            setModalOpen(false);
        }
    }

    const handleEditPinDetails = (e) => {
        e.preventDefault();

        const pinIndex = pins.findIndex((pin) => pin.id === selectedPin.id);
        if (pinIndex >= 0) {
            const updatedPin = { ...pins[pinIndex] };

            // Assuming you have state variables named title, description, and uploadedImage.
            if (title) updatedPin.title = title; // Update title
            if (description) updatedPin.description = description; // Update description
            if (uploadedImage) updatedPin.image.src = uploadedImage; // Update image



            const updatedPins = [...pins];
            updatedPins[pinIndex] = updatedPin;



            setPins(updatedPins);
            setSelectedPin(updatedPin); // <-- This will update the selectedPin details

            setModalOpen(false);
            setFileLabel("Update Thumbnail Image");

        }
    }

    const handleImageUpload = (e) => {


        const file = fileInputRef.current.files[0];
        if (file) {
            setFileLabel(file.name);
        } else {
            setFileLabel("Update Thumbnail Image");
        }

        if (file) {
            // Here, you would normally use a service like Cloudinary or Firebase to upload the image and get a URL. 
            // For now, we will just simulate this using an Object URL (this is not for production use).
            const uploadedImageUrl = URL.createObjectURL(file);

            setUploadedImage(uploadedImageUrl);
        }
    }



    return (
        <>
            <nav className={`rightPanel ${visible ? '' : 'hidden'}`}>
                {
                    selectedPin && (
                        <div className="pinDetails">
                            <img src={selectedPin.image.src || 'path-to-default-image.png'} alt="Pin" className="pinImage" />
                            <div className='pinDetailsContainer'>
                                {/* <div className='pinTopSection'> */}
                                <h2 className="pinTitle">{selectedPin.title}</h2>
                                <p className="pinDescription">{selectedPin.description}</p>
                                <div className="pinMeta">
                                    <span className="pinDate">{selectedPin.created.toLocaleDateString()}</span>
                                    <span className="pinAuthor">{selectedPin.createdBy}</span>
                                </div>
                                <div className='editPinContainer'>
                                    {/* 
                                    <form onSubmit={addComment}>
                                        <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment" />
                                        <button type="submit">Add comment</button>
                                    </form> */}

                                    <div>
                                        <button onClick={editPinDetails}>
                                            <span>
                                                {/* <img/> */}
                                                <span>Edit details</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* </div> */}

                                <div className='pinMetaData'>
                                    Pin Meta Data
                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                        <span>Color:</span>
                                        <span className="">{selectedPin.color}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                        <span>last updated :</span>
                                        <span className="">{selectedPin.updated.toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                        <span>last updated by:</span>
                                        <span className="">{selectedPin.updatedBy}</span>
                                    </div>

                                    <hr></hr>
                                </div>
                            </div>
                        </div>

                    )
                }
                {
                    selectedPin && (
                        <div className="pinComments">
                            {selectedPin.comments.length === 0 ? (
                                <>
                                    <p>No comments available</p>
                                    <div style={{ marginTop: "10px" }}>
                                        <button onClick={addComment}>
                                            <span>
                                                {/* <img/> */}
                                                <span>Add comment</span>
                                            </span>
                                        </button>
                                    </div>
                                </>


                            ) : (
                                <>
                                    <div className="add-comment-button">
                                        <button onClick={addComment}>
                                            <span>
                                                {/* <img/> */}
                                                <span>Add comment</span>
                                            </span>
                                        </button>
                                    </div>
                                    {[...selectedPin.comments].reverse().map((comment, index) => (
                                        <div key={comment.id} className="comment">
                                            <div><span className="smallSpan">#{selectedPin.comments.length - index}</span></div>
                                            <div>
                                                <span className="commentUser">{comment.user}</span>
                                                <span className="smallSpan">{comment.created.toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ textAlign: "left" }}>
                                                <span className="commentText">{comment.comment}</span>
                                            </div>
                                        </div>


                                    ))}

                                </>
                            )}
                        </div>

                    )
                }


            </nav>

            {selectedPin && (<Modal
                show={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalType === "add" ? "Add Comment" : "Edit Pin Details"}
            >
                {modalType === "add" ? (
                    <form onSubmit={handleAddComment}>
                        <textarea placeholder="Add a comment" required onChange={e => setComment(e.target.value)}></textarea>
                        <button type="submit">Add</button>
                        <button onClick={() => setModalOpen(false)}>Cancel</button>
                    </form>
                ) : (
                    <form onSubmit={handleEditPinDetails}>
                        <input type="text" placeholder="Title" maxLength={30} required value={title} onChange={e => setTitle(e.target.value)} />
                        <input type="text" placeholder="Description" maxLength={200} required value={description} onChange={e => setDescription(e.target.value)} />

                        <label htmlFor="fileInput" className="custom-file-upload">
                            {fileLabel}
                        </label>
                        <input type="file" id="fileInput" accept="image" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} />


                        <button type="submit">Edit</button>
                        <button onClick={() => setModalOpen(false)}>Cancel</button>
                    </form>
                )}
            </Modal>)}
        </>
    );


};
