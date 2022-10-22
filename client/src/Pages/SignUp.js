import { useState } from 'react'
import './style/App.css'

function App() {

  const [firstname, setFirstName ] = useState('')
  const [lastname, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signUp(event){
    event.preventDefault()

    const response = await fetch ('http://localhost:1337/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
    })

    const data = await response.json()

    console.log(data)

    if (data.status === 'ok'){
      window.location.href =  '/canvas'
    }else{
      alert('Duplicate Email')
    }
  }

  return(
    <div className='main'>
      <div className='sub-main'>
        <h1>Sign up</h1>
        <form onSubmit={signUp}>
          <input
            className='input-box'
            value = {firstname}
            onChange = {(e) => setFirstName(e.target.value)}
            type = "text"
            placeholder = "Firstname" 
          />
          <br/><br/>
          <input
            className='input-box'
            value = {lastname}
            onChange = {(e) => setLastName(e.target.value)}
            type = "text"
            placeholder = "Lastname" 
          />
          <br/><br/>
          <input
            className='input-box'
            value  = {email}
            onChange = {(e) => setEmail(e.target.value)}
            type = "email"
            placeholder = "Email"        
          />
          <br/><br/>
          <input
            className='input-box'
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
            type = "password"
            placeholder = "Password"
          />
          <br/><br/>
          <button type='submit' value = 'Signup'>Sign Up</button>
        </form>
      </div>
    </div>
  )
}

export default App;
