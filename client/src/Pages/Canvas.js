import React from "react";
import CanvasDraw from "react-canvas-draw";

function App() {
    return(
        <CanvasDraw 
            canvasHeight={750}
            canvasWidth={1500}
            brushRadius = {1}
            brushColor = {"#" + Math.floor(Math.random() * 16777215).toString(16)}
         />
    )
        
}

export default App