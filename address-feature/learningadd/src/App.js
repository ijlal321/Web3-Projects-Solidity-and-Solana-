import './App.css';
import { useEffect, useState, useRef, useCallback } from "react";
import Select from 'react-select';
import copySVG from "./assests/copy-svgrepo-com.svg";

const CustomOption = (props) => {
  const { data, innerRef, innerProps } = props;

  const handleButtonClick = () => {
    alert(`Button clicked for ${data.label}`);
  };

  return (
    <div ref={innerRef} {...innerProps} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: "20px", padding: "5px" }}>
      {data.label}
      <button onClick={handleButtonClick}>Click Me</button>
    </div>
  );
};
var isMouseCLicked = false;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const componentRef = useRef(null);


  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
  ];

  const selectClickHandle = (event) => {

    if (componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const { clientX, clientY } = event;

      const isInComponent =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      console.log(isInComponent);
      if (isInComponent == false) {
        setIsOpen(false);
      }
    }
  }

  const selectBlurHandle = () => {
    console.log("blur");
    setIsOpen(false);
  }

  const selectkeyHandle = (event) => {
    console.log("key");
    if (event.key === 'Enter' || event.keyCode === 13 || event.key === ' ' || event.keyCode === 32) {
      setIsOpen(true);
    }
  };

  const selectMousePress = (event) => {
    console.log("mouse");
    setIsOpen(!isOpen);
  }



  // ===================

  // const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose an option');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    alert('Custom button clicked');
  };

  return (
    <div className="App">
      <div id="outer-container"
      >
        <select id="fruit" name="fruit"
          ref={componentRef}
          onMouseDown={selectMousePress}
          onClick={selectClickHandle}
          onBlur={selectBlurHandle}
          onKeyDown={selectkeyHandle}
        >
          <option value="apple" >Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
          <option value="fig">Fig</option>
          <option value="grape">Grape</option>
        </select>

        <div className='hidden-copy'
        >
          {isOpen && options.map((item, idx) => (
            <p key={idx} style={{ fontSize: "0.95rem" }}>copy</p>
          ))}
        </div>

      </div>
      <h3 style={{ paddingTop: "200px" }}>currently closed {isOpen ? "true" : "false"}</h3>







      <div id="outer-container" >
        <Select
          options={options}
          components={{ Option: CustomOption }} // Use custom option component
        />
      </div>


      <div className="custom-select">
        <button className="select-button" onClick={toggleDropdown}>
          {selectedOption}
        </button>
        {isOpen && (
          <div className="select-options">
            <div className="option" onClick={() => handleOptionClick('Option 1')}>Option 1 <button>123</button></div>
            <div className="option" onClick={() => handleOptionClick('Option 2')}>Option 2</div>
            <div className="option" onClick={() => handleOptionClick('Option 3')}>Option 3</div>
            <button className="custom-button" onClick={handleButtonClick}>Custom Action</button>
          </div>
        )}
      </div>


    </div>
  );


}

export default App;
