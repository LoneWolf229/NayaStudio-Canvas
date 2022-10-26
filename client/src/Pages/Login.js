import { useState } from 'react'
import './style/App.css'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function loginUser(event){
    event.preventDefault()

    const response = await fetch ('http://localhost:1337/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if(data.user){
      sessionStorage.setItem('token', data.user)
      sessionStorage.setItem('firstname', data.firstname)
      sessionStorage.setItem('lastname', data.lastname)
      sessionStorage.setItem('email', data.email)
      sessionStorage.setItem('brushcolor', data.brushcolor)

      alert('Login Successful')
      window.location.href =  '/canvas'
    }else{
      alert('Please check your username and password!')
    }

    if (data.status === 'ok'){
      //history.push('/login')
    }
  }

  return(
    <div className='main'>
      <div className='sub-main'>
        <h1>Log in to continue</h1>
        <form onSubmit={loginUser}>
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
          <a className='a-link' href="/forgotpassword">Forgot password?</a>
          <br/><br/>
          <button type='submit' value = 'Login'>Log in</button>
          <br/><br/>
          <p>Don't have an account? <a className='a-link' href="/signup">Sign up</a></p>
        </form>
      </div>
    </div>

  )
}

export default App;
