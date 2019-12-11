import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'
import './index.css'

const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return (
        <div style={footerStyle}>
            <br />
            <em>Christopher Kotsopoulos</em>
        </div>
    )
}

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)

    const hook = () => {
        noteService.getAll().then(initalNotes => {
            setNotes(initalNotes)
        })
    }

    useEffect(hook, [])

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService.update(id, changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id !== id ? note : returnedNote))
        })
        .catch(error => {
            setErrorMessage(
                `Note '${note.content}' was already removed from server`
            )
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            setNotes(notes.filter(n => n.id !== id))
        })
    }

    const rows = () => notesToShow.map(note =>
        <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
        />
    )

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            date: new Date().toISOString(),
            important: false,
            id: notes.length + 1,
        }
        
        noteService.create(noteObject).then(returnedNote => {
            setNotes(notes.concat(returnedNote))
            setNewNote('')
        })
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    Show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {rows()}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} />
                <button type="submit">Save</button>
            </form>
            <Footer />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)