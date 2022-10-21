import React from 'react'
import{ BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'

const App = () =>{
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" component={Login} />
                    <Route path = "/signup" component={SignUp}/>
                </Routes> 
            </BrowserRouter>
        </div>
    )
}

export default App