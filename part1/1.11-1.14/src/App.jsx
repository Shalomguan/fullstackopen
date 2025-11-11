
import { useState, useMemo } from 'react'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(() => getRandomInt(0, anecdotes.length - 1))
  const AnotherInt = () => {
  return  (
     setSelected(getRandomInt(0, anecdotes.length - 1))
    )
  }
  const [votes, setVotes] = useState({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 })
  const copy = { ...votes }
  const Vote = () => {
    const currentVotes = votes[selected]
    const newVotesCount = currentVotes + 1
    const newVotes = {
      ...votes,
      [selected]:newVotesCount
    }
    setVotes(newVotes)
  }
  const mostVotedIndex = useMemo(() => {
    let maxVotes = -1
    let maxIndex = 0

    Object.entries(votes).forEach(([index, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount
        maxIndex = parseInt(index)
      }
    })

    return maxVotes > 0 ? maxIndex : null
  }, [votes]) // 依赖votes，只有在votes变化时才重新计算

  const mostVotes = mostVotedIndex !== null ? votes[mostVotedIndex] : 0
 
  console.log(copy)
  console.log(selected)
  return (
    <>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <p>has {votes[selected]} votes</p>
      <Button onClick={Vote} text="vote" />
      <Button onClick={AnotherInt} text="another anecdote" />
      
      <h2>Anecdote with most votes</h2>
      {mostVotedIndex !== null ? (
        <>
          <div>{anecdotes[mostVotedIndex]}</div>
          <p>has {mostVotes} votes</p>
        </>
      ) : (
        <p>No votes yet</p>
      )}
    </>
  )
}

export default App