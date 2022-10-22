import React, {useRef} from "react";
import {useEffect} from 'react'
import CanvasDraw from "react-canvas-draw";
import jwtDecode from 'jwt-decode'


const Canvas = () => {

    async function populateCanvas(){
        const req = await fetch('http://localhost:1337/api/canvas', {
            headers: {
                'x-access-token': localStorage.getItem('token'),
            },
        })
        const data = await req.json()
        if (data.status === 'ok') {
            const firstname = data.firstname
            const lastname = data.lastname
            //const email = data.email
            document.getElementById('test').innerHTML = firstname+lastname
        } else {
            alert('Authentication Error')
            window.location.href('/')
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(token){
            const user = jwtDecode(token)
            console.log(user)
            if (!user) {
                localStorage.removeItem('token')
                window.location.href =  '/login'
            } else{
                populateCanvas()
            }

        }
    }, [])

    const screencanvas1 = useRef('CanvasDraw')
    const screencanvas2 = useRef('CanvasDraw')

    var variable = ""

    const handleSave= (event) => {
        event.preventDefault()
        variable = screencanvas1.current.getSaveData();
        console.log(variable);
    }

    const handleLoad= (event) => {
        event.preventDefault()
        screencanvas2.current.loadSaveData(variable);
        //console.log(data);
    }
    
    return(
        <div>
            <p id="test"> </p>

            <form>
            <button onClick={handleSave}>Save</button>
            <br/>
            <button onClick={handleLoad}>Load</button>
            </form>

            <CanvasDraw 
            canvasHeight={300}
            canvasWidth={300}
            brushRadius = {1}
            brushColor = {"#" + Math.floor(Math.random() * 16777215).toString(16)}
            hideGrid={true}
            ref={screencanvas1}
            style={ { border: '1px solid' } }
            />
            <br/><br/>
            <CanvasDraw 
            canvasHeight={300}
            canvasWidth={300}
            brushRadius = {1}
            brushColor = {"#" + Math.floor(Math.random() * 16777215).toString(16)}
            hideGrid={true}
            ref={screencanvas2}
            disabled={true}
            style={ { border: '1px solid' } }
            />

        </div>

        
    )
        
}

export default Canvas