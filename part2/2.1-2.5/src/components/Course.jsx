const Course = (props) => {
  const totalExercises = props.course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
      <Getsum sum = {totalExercises}/>
    </div>
  )
}
const Getsum = (props) => {
  return (
    <div>
      total of {props.sum} exercises
    </div>
  )
}
const Header = (props) => {
  return(
    <h1>{props.name}</h1>
  )
}
const Content = (props) => {
  return (
    <div>
      {props.parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}
const Part = (props) => {
  return (
    <div>
      <p>{props.name} {props.exercises}</p>
    </div>
  )
}
export default Course