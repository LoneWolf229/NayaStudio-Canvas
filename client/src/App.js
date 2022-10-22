import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Canvas from './pages/Canvas'

const App = () =>{
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <Login/> } />
                    <Route path = "/signup" element = { <SignUp/> } />
                    <Route path = "/canvas" element = { <Canvas/> } />
                </Routes> 
            </BrowserRouter>
        </div>
    )
}

export default App