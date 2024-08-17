import { useState, useEffect } from 'react'
import './App.css'

let startX = null;
let curX = null;

function App() {
  const [isDragging, setIsDragging] = useState(false)
  const [buttonWidth, setButtonWidth] = useState(null)

  useEffect(() => {
    const myBtn = document.querySelector(".outer-div .button");
    if (myBtn) {
      setButtonWidth(myBtn.offsetWidth)
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging == true && buttonWidth) {
        curX = event.clientX;
        if (Math.abs(startX - curX) > 10) {
          setButtonWidth(buttonWidth + curX - startX);
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {Array.from({ length: 3 }, (_, index) => (
        <div className='outer-div' key={index}>
          <button className='button'
            style={buttonWidth && { width: buttonWidth }}
          >
            123
          </button>
          <div
            className='button-resizer'
            onMouseDown={(e) => { setIsDragging(true); startX = e.clientX;}}
          >
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
