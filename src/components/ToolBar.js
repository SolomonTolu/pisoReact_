import React from 'react'

export const ToolBar = (props) => {
    return (
        <nav className={`toolbar ${props.visible ? '' : 'hidden'}`}>
            <div>
                <span className='projectName'>Piso</span>
            </div>
        </nav>
    )

}