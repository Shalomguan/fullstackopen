import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  
  const [showAll, setShowAll] = useState(true)
   useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
   }, [])
  
  console.log('render', notes.length, 'notes')
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))
      })
  }
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      
    }
    noteService
      create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  const notestoshow = showAll ?
    notes : notes.filter(note => note.important === true)
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notestoshow.map((note) => (
          <Note key={note.id} note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}/>
        ))}
        <form onSubmit={addNote}>
          <input value={newNote} 
          onChange={handleNoteChange}/>
          <button type="submit">save</button>
        </form>
      </ul>
      
    </div>
  )
}

export default App