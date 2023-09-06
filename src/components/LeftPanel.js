import React from 'react'

export const LeftPanel = ({ visible, fileUploaded, files, setActivePage }) => {
    return (
        <nav className={`leftPanel ${visible ? '' : 'hidden'}`}>
            <div className='leftPanelContainer'>
                <div className='header'>
                    <div>
                        <h4>Pages</h4>
                    </div>
                    <div>
                        <label htmlFor="myfile" className="custom-file-upload" >add</label>
                        <input onChange={(e) => fileUploaded(e)} type="file" id="myfile" name="myfile" accept="image" style={{ display: 'none' }} />
                    </div>
                </div>
                <div className='pages'>
                    {files?.map((file, index) => (
                        <button key={index} onClick={() => setActivePage(index)}>Page {index + 1}</button>
                    ))}
                </div>
            </div>
        </nav>
    )
}



{/* <label htmlFor="fileInput" className="custom-file-upload">
                            {fileLabel}
                        </label> */}
{/* <input type="file" id="fileInput" accept="image" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} /> */ }