import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)
  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  
  const [showAll, setShowAll] = useState(true)
   useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')
  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id:String(notes.length+1)
    }
    setNotes(notes.concat(noteObject))
    setNewNote(' ')
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
          <Note key={note.id} note={note} />
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