import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
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
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
   }, [])
  
  console.log('render', notes.length, 'notes')
  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    axios.put(url, changedNote).then(response => {
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
    axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
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