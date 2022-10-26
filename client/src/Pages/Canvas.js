import React, {useRef, useEffect, useState} from "react";
import CanvasDraw from "react-canvas-draw";
import jwtDecode from 'jwt-decode';

import StickyBox from "react-sticky-box";
import useCollapse from 'react-collapsed';

import './style/Canvas.css'

function Canvas() {
    

    const [loadsketchname, setLoadSketchName] = useState('')
    const [currentsketchname,setCurrentSketchName] = useState()

    async function populateUserPanels(){
        const req = await fetch('http://localhost:1337/api/userlist', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({  
            sketchname: sessionStorage.getItem('currentsketchname')
            })
        })

        const data = await req.json()
        console.log(data)

        if(data.status === 'ok'){
            let namevalues = data.names
            let colorvalues = data.colors
            let list = document.getElementById('userlist')

            list.innerHTML=''

            for(let loop = 0; loop < namevalues.length; loop+=1){
                let li = document.createElement("li");
                li.innerText=namevalues[loop];
                li.style.color = colorvalues[loop]
                //li.firstChild().style.color = colorvalues[loop]
                list.appendChild(li);
            };
        }else{
            let list = document.getElementById('userlist')
            list.innerHTML=''
            let li = document.createElement("li");
            li.innerText="No User found";
            list.appendChild(li);

        }
    }

    async function populateSketchPanels(){
        const req = await fetch('http://localhost:1337/api/panels', {})
        const data = await req.json()

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
            setCurrentSketchName( sessionStorage.getItem('currentsketchname'))

        } else {
            alert('Authentication Error')
            window.location.href='/'
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        console.log(token)

        if(token){
            const user = jwtDecode(token)
            console.log(user)
            if (!user) {
                window.location.href =  '/'
            } else{
                auth()
                populateSketchPanels()
                populateUserPanels()
                sessionStorage.setItem('currentsketchname',"Untitled");
            }
        }else {
            alert('User not logged in')
            window.location.href='/'
        }
    }, [])

    useEffect(()=>{
        document.getElementById('headid').innerHTML = ( "SketchName : "+ currentsketchname);
        populateSketchPanels()
        document.getElementById('userdisplay').innerHTML = ("User : "+sessionStorage.getItem('firstname')+' '+sessionStorage.getItem('lastname') )
        populateSketchPanels()
    },[currentsketchname])

    const screencanvas1 = useRef('CanvasDraw')

    async function handleSave(event){
        event.preventDefault()
        const sketch = screencanvas1.current.getSaveData();
        let sketchname = ''
        let sketchtype = ''
        let  id = parseInt(sessionStorage.getItem('totalsketchcount'))

        if(sessionStorage.getItem('currentsketchname') === 'Untitled'){
            sketchname = "Sketch "+(id+1).toString()
            console.log("Inside Save: "+sessionStorage.getItem('currentsketchname'))
            console.log("Inside Save: "+currentsketchname)
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
                setCurrentSketchName(sessionStorage.getItem('currentsketchname'))
            }
            populateUserPanels()
            
            alert('Saved to DB')

        }else{
            alert('Unable to save')
        }
    }

    async function handleLoad (event) {
        event.preventDefault()
        let sname = loadsketchname
        const res = await fetch('http://localhost:1337/api/loadcanvas', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                sketchname: sname
            })
            
        })
        const data = await res.json()
        if(data.status === 'ok'){
            alert('New sketch loading!')
            screencanvas1.current.loadSaveData(data.sketch.sketchstring);
            sessionStorage.setItem('currentsketchname',data.sketch.sketchname);
            setCurrentSketchName(sessionStorage.getItem('currentsketchname'))

            console.log("Inside Load : ", sessionStorage.getItem('currentsketchname'))
            console.log("Sketch on screen: " + currentsketchname)
            populateUserPanels()
        }else if(data.status === 'No Data'){
            alert('Sketch does not exist')
            console.log("Inside Load else: ", data.sketch.sketchname)
            populateSketchPanels()
            populateUserPanels()
            screencanvas1.current.eraseAll();
        }


        //screencanvas1.current.loadSaveData(variable);
        console.log("At End : " + sessionStorage.getItem('currentsketchname')) 
    }
    //final commit

    async function handleNew (event){
        event.preventDefault()

        alert('New canvas?')
        screencanvas1.current.eraseAll();
        sessionStorage.setItem('currentsketchname', 'Untitled')
        setCurrentSketchName(sessionStorage.getItem('currentsketchname'))
        populateSketchPanels()
        populateUserPanels()        
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
            <StickyBox><header id = "headid" > </header></StickyBox>
            <p id="userdisplay" ></p>
            <div style={{display: "flex", alignItems: "flex-start"}}>
                <StickyBox>
                    <div>
                        <CanvasDraw 
                            canvasHeight={500}
                            canvasWidth={1000}
                            brushRadius = {1}
                            brushColor = {sessionStorage.getItem('brushcolor')}
                            hideGrid={true}
                            ref={screencanvas1}
                            style={ { border: '2px solid', borderRadius:'4px'} }
                        />
                        <br/>
                        <div>
                            <form>
                            <input className='input-box' value  = {loadsketchname}  
                            onChange = {(e) => setLoadSketchName(e.target.value)}
                            placeholder = "Enter Sketch Name from list to load"   />

                                <button onClick={handleLoad}>Load</button>

                                <br/><br/>
                                
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handleNew}>New</button>
                            </form>
                        </div>
                    </div>
                </StickyBox>
                <StickyBox>
                    <div style={{height: 475, width:450, padding:"10px"}}>
                        <Section title="SKETCHES" defaultExpanded="true" >
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