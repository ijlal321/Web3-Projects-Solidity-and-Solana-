import './App.css';
import { useEffect, useState, useRef } from "react";
import Select from 'react-select';

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
var isOtherSelected = false;

function App() {

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const selectClickHandle = () => {
    console.log("var state: ", isOtherSelected);    
    console.log("click"); 
    if (!isOtherSelected) {
      setIsOpen(true);
    }
    else {
      setIsOpen(false);
      isOtherSelected = false;
    }
  }
  const selectBlurHandle = () => {
    console.log("var state: ", isOtherSelected);    
    console.log("blur"); 
    setIsOpen(false);
  }
  const selectChangeHandle = (event) => {
    console.log(event);
    console.log("var state: ", isOtherSelected);    
    console.log("change");
    isOtherSelected = true;
    setIsOpen(false);
  }




  return (
    <div className="App">
      <div id="outer-container">
        <select id="fruit" name="fruit"
          onClick={selectClickHandle}
          onBlur={selectBlurHandle}
          onChange={selectChangeHandle}
        >
          <option value="apple" >Apple</option>
          <option value="banana">Banana</option>
          <option value="cherry">Cherry</option>
          <option value="date">Date</option>
          <option value="fig">Fig</option>
          <option value="grape">Grape</option>
        </select>
      </div>
      <h3 style={{paddingTop:"200px"}}>currently closed {isOpen ? "true" : "false"}</h3>
      <div id="outer-container" >
        <Select
          options={options}
          components={{ Option: CustomOption }} // Use custom option component
        />
      </div>

    </div>
  );
}

export default App;
