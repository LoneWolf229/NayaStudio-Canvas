import React, {useRef, useState, useEffect} from "react";
import CanvasDraw from "react-canvas-draw";
import jwtDecode from 'jwt-decode';

import StickyBox from "react-sticky-box";
import useCollapse from 'react-collapsed';

import './style/Canvas.css'

const Canvas = () => {
    sessionStorage.setItem('currentsketchname',"Untitled");

    async function populatePanels(){
        const req = await fetch('http://localhost:1337/api/panels', {})
        const data = await req.json()
        console.log(data)
        if(data.status === 'ok'){
            let values = data.names
            let list = document.getElementById('sketchlist')

            list.innerHTML=''

            values.forEach((item) => {
                let li = document.createElement("li");
                li.innerText=item;
                list.appendChild(li);
            });
        }else{
            let list = document.getElementById('sketchlist')
            let li = document.createElement("li");
            li.innerText="Error";
            list.appendChild(li);

        }
    }

    async function auth(){
        const req = await fetch('http://localhost:1337/api/auth', {
            headers: {
                'x-access-token': sessionStorage.getItem('token'),
            },
        })
        const data = await req.json()
        if (data.status === 'ok') {
            sessionStorage.setItem('totalsketchcount', parseInt(data.totalsketchcount))
            console.log('count '+sessionStorage.getItem('totalsketchcount'))
            document.getElementById('pheader').innerHTML = sessionStorage.getItem('currentsketchname') 
            document.getElementById('headid').innerHTML = sessionStorage.getItem('firstname') +' '+ sessionStorage.getItem('lastname')
        } else {
            alert('Authentication Error')
            window.location.href='/'
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token')

        if(token){
            const user = jwtDecode(token)
            console.log(user)
            if (!user) {
                window.location.href =  '/'
            } else{
                auth()
                populatePanels()
            }
        }
    }, [])

    const screencanvas1 = useRef('CanvasDraw')

    async function handleSave(event){
        event.preventDefault()
        const sketch = screencanvas1.current.getSaveData();
        let sketchname = ''
        let sketchtype = ''
        let  id = parseInt(sessionStorage.getItem('totalsketchcount'))

        if(sessionStorage.getItem('currentsketchname') === 'Untitled'){
            sketchname = "Sketch "+(id+1).toString()
            sketchtype = 'new'

        }else{
            sketchname = sessionStorage.getItem('currentsketchname')
            sketchtype = 'existing'
        }

        const response = await fetch('http://localhost:1337/api/savecanvas',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                
                sketchstring: sketch,
                sketchname: sketchname,
                sketchtype: sketchtype,
                email: sessionStorage.getItem('email') 
            })
        })
        const data = await response.json()

        if(data.status === 'ok'){
            if(sketchtype === 'new'){
                sessionStorage.setItem('totalsketchcount', parseInt(sessionStorage.getItem('totalsketchcount'))+1)
                sessionStorage.setItem('currentsketchname', sketchname)
            }
            
            alert('Saved to DB')

        }else{
            alert('Unable to save')
        }
    }

    const handleLoad= (event) => {
        event.preventDefault()
        //screencanvas1.current.loadSaveData(variable);
    }

    const handleNew= (event) =>{
        event.preventDefault()

        alert('New canvas?')
        screencanvas1.current.eraseAll();
        sessionStorage.setItem('currentsketchname', 'Untitled')
        
    }

    function Section(props) {
        const config = {
            defaultExpanded: props.defaultExpanded || false,
            collapsedHeight: props.collapsedHeight || 0
        };
        const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
    return (
        <div className="collapsible">
            <div className="header" {...getToggleProps()}>
                <div className="title">{props.title}</div>

            </div>
            <div {...getCollapseProps()}>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
        );
    }
    
    return(
        <div>
            <StickyBox><header id = "headid" > Sketching Application</header></StickyBox>
                <div>
                <p id= 'pheader'>
                    username
                </p>
                </div>
            
            <div style={{display: "flex", alignItems: "flex-start"}}>
                <StickyBox>
                    <div>
                        <CanvasDraw 
                            canvasHeight={500}
                            canvasWidth={1050}
                            brushRadius = {1}
                            brushColor = {"#" + Math.floor(Math.random() * 16777215).toString(16)}
                            hideGrid={true}
                            ref={screencanvas1}
                            style={ { border: '2px solid', borderRadius:'4px'} }
                        />
                        <br/>
                        <div>
                            <form>
                                <button onClick={handleSave}>Save</button>

                                <button onClick={handleLoad}>Load</button>

                                <button onClick={handleNew}>New</button>
                            </form>
                        </div>
                    </div>
                </StickyBox>
                <StickyBox>
                    <div style={{height: 475, width:450, padding:"10px"}}>
                        <Section title="SKETCHES" defaultExpanded="false">
                            <ul id='sketchlist'>
                            </ul>
                        </Section>
                        <Section title="USERS" defaultExpanded="false">
                            <ul id='userlist'>
                            </ul>
                        </Section>
                    </div>
                </StickyBox>
            </div>
 
        </div>
        )}

export default Canvas