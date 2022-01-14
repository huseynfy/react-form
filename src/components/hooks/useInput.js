import { useState } from "react";

// I created this custom hook in order to prevent code cloning
export default function useInput(validateValue) {
  // we're getting the entered value from our inputs to here
  const [enteredValue, setEnteredValue] = useState("");

  // I'm using this isTouched state in order to make sure that a user is -- 
  // -- getting an error message if an input is empty
  const [isTouched, setIsTouched] = useState(false);

  // custom arrow function which is being sent as an argument in useInput function comes here
  const valueIsValid = validateValue(enteredValue);

  const hasError = !valueIsValid && isTouched;

  const changeHandler = (event) => {
    setEnteredValue(event.target.value);
  };
  const blurHandler = () => {
    setIsTouched(true);
  };

  // resetting inputs after submission
  const reset = () =>{
      setEnteredValue('');
      setIsTouched(false);
  }
  
  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    changeHandler,
    blurHandler,
    reset
  };
}
