import { useState } from 'react'
//import { useHistory } from 'react-router-dom'
import './App.css';

function App() {
  //const history = useHistory()


  const [name, setName ] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signUp(event){
    event.preventDefault()

    const response = await fetch ('http://localhost:1337/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data = await response.json()

    console.log(data)

    if (data.status === 'ok'){
      //history.push('/login')
    }
  }

  return(
    <div>
      <h1>Sign up</h1>
      <form onSubmit={signUp}>
        <input 
          value = {name}
          onChange = {(e) => setName(e.target.value)}
          type = "text"
          placeholder = "Name" 
        />
        <br/>
        <input
          value  = {email}
          onChange = {(e) => setEmail(e.target.value)}
          type = "email"
          placeholder = "Email"        
        />
        <br/>
        <input
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          type = "password"
          placeholder = "Password"
        />
        <br/>
        <input type = "submit" value = "Sign Up" />
      </form>
    </div>
  )
}

export default App;
