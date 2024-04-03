'use client';
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

export function DrawCanvas() {
  const [canvas, setCanvas] = useState();
  const [brushSize, setBrushSize] = useState(30);
  const [color, setColor] = useState('#30250D');
  const [opacity, setOpacity] = useState(1);
  const [history, setHistory] = useState([]);

  const hexToRGB = (hex, opacity) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };


  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true
    });

    setCanvas(canvas);

    canvas.freeDrawingBrush.width = parseInt(brushSize, 10);
    canvas.freeDrawingBrush.color = hexToRGB(color, parseFloat(opacity));

    canvas.on('path:created', function () {
      let serialized = JSON.stringify(canvas);
      setHistory([...history, serialized]);
    });

    return () => {
      canvas.dispose();
    };
  }, []);



  function clearCanvas() {
      canvas.clear();
  }

  function handleImage(e) {
      let reader = new FileReader();
      reader.onload = function (event) {
          let imgObj = new Image();
          imgObj.src = event.target.result;
          imgObj.onload = function () {
              let imgInstance = new fabric.Image(imgObj, {
                  left: 0,
                  top: 0,
                  width: canvas.width,
                  height: canvas.height
              });
              canvas.setBackgroundImage(imgInstance, canvas.renderAll.bind(canvas));
          }
      }
      reader.readAsDataURL(e.target.files[0]);
  }

 

  // window.addEventListener('keydown', function(evt) {
  //     evt.stopImmediatePropagation();
  //     console.log('evt', evt);
  //     if (evt.key === 'z' && (evt.ctrlKey || evt.metaKey)) {
  //       undo();
  //     }
  // });

  

  function exportDrawing() {
      let dataUrl = canvas.toDataURL({ format: 'png' });
      let link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'drawing.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }


  // async function uploadImage(formData) {
  //   'use server';
  //   const blob = await put(imageFile.name, canvas.toDataURL({ format: 'png' }), {
  //     access: 'public',
  //   });

  //   revalidatePath('/');
    
  //   return blob;
  // }

  function handleBrushSizeChange(e) {
    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    setBrushSize(e.target.value);
  }

  function handleColorChange(e) {
    canvas.freeDrawingBrush.color = hexToRGB(e.target.value, parseFloat(opacity));
    setColor(e.target.value);
  }
  
  function handleOpacityChange(e) {
    canvas.freeDrawingBrush.color = hexToRGB(color, parseFloat(e.target.value));
    setOpacity(e.target.value);
  }
  

  function undo() {
    // if (history.length > 0) {
    //     var lastOperation = history.pop();
    //     canvas.clear();
    //     canvas.loadFromJSON(lastOperation, canvas.renderAll.bind(canvas));
    //     setHistory(lastOperation);
    // }
  }
  
  function sendImage() {
    const formData = new FormData();
    formData.append('image', canvas.toDataURL({ format: 'png' }));
    
    fetch('/api/image/create', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    });
  }

  return (
    <div>
      <canvas id="canvas" width="800" height="600"></canvas>
      
      <div>
          <label htmlFor="brushSize">Brush Size:</label>
          <input 
            type="range" 
            onChange={handleBrushSizeChange} 
            min="1" 
            max="120" 
            value={brushSize} />

          <label htmlFor="color">Color:</label>
          <input 
            type="color"
            onChange={handleColorChange}  
            value={color} />
          
          <label htmlFor="opacity">Opacity:</label>
          <input 
            type="range" 
            onChange={handleOpacityChange}
            value={opacity}
            min="0"
            max="1"
            step="0.1" />

          <button onClick={clearCanvas}>Clear</button>
          <button onClick={undo}>Undo</button>
          <button onClick={exportDrawing}>Export as PNG</button>
          <input type="file" onChange={handleImage} accept="image/*" />
          <button onClick={sendImage}>Send Image</button>
      </div>
    </div>
  );
}