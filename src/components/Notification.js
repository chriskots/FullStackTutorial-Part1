import React from 'react'
import '../index.css'

const Notifcation = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}

export default Notifcation