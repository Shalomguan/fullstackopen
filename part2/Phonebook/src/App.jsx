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
  const [messageType, setMessageType] = useState('success')
  const [infoMessage, setInfoMessage] = useState(null)
  const Notification = ({ message,type}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type}>
      {message}
    </div>
  )
  }
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
          setMessageType('error')
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

    // 1. 修改：使用 find 找到那个具体的人 (而不是用 some 返回 true/false)
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    // 2. 如果人已经存在
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            // 更新成功，修改状态
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            setInfoMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessageType('error')
            // 处理错误：比如用户在服务器已经被删除了
            setInfoMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )
            // 从本地状态中移除这个“幽灵”用户
            setPersons(persons.filter(n => n.id !== existingPerson.id))
            setTimeout(() => {
              setInfoMessage(null)
            }, 5000)
          })
      }
      return // 3. 关键：这里直接 return，终止函数。否则代码会继续往下走去执行创建操作
    }


    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: String(Date.now()) 
    }

    personService
      .create(newPersonObject)
      .then(response => {
        setMessageType('success')
        setPersons(persons.concat(response)) 
        setNewName("")
        setNewNumber("")
        setInfoMessage(`Added ${response.name}`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
      })
  }
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} type={messageType} />
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