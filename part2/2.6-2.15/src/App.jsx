import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
const PersonRow = ({ name, number,handleDelete }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
      <td>
        <button onClick={handleDelete}>delete</button>
      </td>
    </tr>
  )
}
const Filter = ({ filter, handleFilterChange }) => (
  <div>
    <form>
      filter shown with
      <input 
        value={filter}
        onChange={handleFilterChange}
      />
    </form>
  </div>
)
const PersonForm = ({ 
  addNote, 
  newName, 
  handleNameChange, 
  newNumber, 
  handleNumberChange 
}) => (
  <form onSubmit={addNote}>
    <div>
      name <input 
        value={newName}
        onChange={handleNameChange} 
      />
    </div>
    <div>
      number <input 
        value={newNumber}
        onChange={handleNumberChange} 
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
const Persons = ({ personsToShow,handleDelete }) => (
  <table>
    <tbody>
      {personsToShow.map(person => 
        <PersonRow 
          key={person.id} 
          name={person.name} 
          number={person.number} 
          handleDelete={() => handleDelete(person.id)}
        />
      )}
    </tbody>
  </table>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(data => {
        console.log('promise fulfilled')
        setPersons(data)
      }
      )
      // axios
      //   .get('http://localhost:3001/persons')
      //   .then(response => {
      //     console.log('promise fulfilled')
      //     setPersons(response.data)
      //   })
    }, [])
  const handleFilterChange = (event) => {
    setFilter(event.target.value) 
  }
  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          alert(
            `The person '${person.name}' was already deleted from server`
          )
          setPersons(persons.filter(p => p.id !== id))
      })
  }
}
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const addNote = (event) => {
    event.preventDefault() 
    
    const exist = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())
    if (exist) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }
    
    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1) 
    }
    personService
      .create(newPersonObject)
      .then(response => {
        setPersons(persons.concat(newPersonObject))
        setNewName("")
        setNewNumber("")
      })
  }
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
        filter={filter} 
        handleFilterChange={handleFilterChange} 
      />

      <h3>Add a new</h3>

      <PersonForm
        addNote={addNote}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
        personsToShow={personsToShow} 
        handleDelete={handleDelete}
      />
      
    </div>
  )
}

export default App