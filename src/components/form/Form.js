import React, { useState, useEffect } from 'react';
import useInput from '../hooks/useInput';
import axios from 'axios';
import '../../App.css';

export default function Form(){
    // getting data from endpoint for select(option) html element
    const [data,setData] = useState([]); 
    // for showing error message for the get method
    const [errorForGetMethod,setErrorForGetMethod] = useState('');
     // for showing success message for the post method
    const [successForPostMethod,setSuccessForPostMethod] = useState('');
    // for showing error message for the post method
    const [errorForPostMethod,setErrorForPostMethod] = useState('');

    // form validation starts from here
    // we're destructuring elements from the useInput custom hook
    // we're sending our custom validation arrow function as an argument
    const { value:enteredName,isValid:enteredNameIsValid,hasError:nameInputHasError,changeHandler:nameValueChangeHandler,blurHandler: nameBlurHandler,reset: resetNameInput} = useInput(value=> value.trim() !=='');

    const { value:enteredEmail,isValid:enteredEmailIsValid,hasError:emailInputHasError,changeHandler:emailValueChangeHandler,blurHandler: emailBlurHandler,reset: resetEmailInput} = useInput(value=> value.includes('@'));

    const { value:enteredPassword,isValid:enteredPasswordIsValid,hasError:passwordInputHasError,changeHandler:passwordValueChangeHandler,blurHandler: passwordBlurHandler,reset: resetPasswordInput} = useInput(value=> value.trim() !=='');

    const { value:enteredOccupation,isValid:enteredOccupationIsValid,hasError:occupationInputHasError,changeHandler:occupationValueChangeHandler,blurHandler: occupationBlurHandler,reset: resetOccupationInput} = useInput(value=> value.trim() !=='');

    const { value:enteredState,isValid:enteredStateIsValid,hasError:stateInputHasError,changeHandler:stateValueChangeHandler,blurHandler: stateBlurHandler,reset: resetStateInput} = useInput(value=> value.trim() !=='');
    //form validation ends here

    // handling form submission here
    const submitHandler = (event) =>{
        // preventing form submission default state
        event.preventDefault();

        // getting form data in an array
        const formData = {name:enteredName,email:enteredEmail,password:enteredPassword,occupation: enteredOccupation, state: enteredState};

        // if the entered values are invalid the function stops execution
        if(!enteredNameIsValid || !enteredEmailIsValid || !enteredPasswordIsValid || !enteredOccupationIsValid || !enteredStateIsValid) return;

        // the post method - using axios package in order to handle error and success states efficiently
        axios.post('https://frontend-take-home.fetchrewards.com/form',formData).then(response=>setSuccessForPostMethod(response.status))
        .catch(error=>setErrorForPostMethod(error.message));

        // resetting the form inputs after submission
        resetNameInput();
        resetEmailInput();
        resetPasswordInput();
        resetOccupationInput();
        resetStateInput();
    }

    // conditionally rendering class names if there is an error
    const nameInputClass = !nameInputHasError ? 'inputs' : 'inputs errorInput';
    const emailInputClass = !emailInputHasError ? 'inputs' : 'inputs errorInput';
    const passwordInputClass = !passwordInputHasError ? 'inputs' : 'inputs errorInput';
    const occupationInputClass = !occupationInputHasError ? 'selection' : 'selection errorSelection';
    const stateInputClass = !stateInputHasError ? 'selection' : 'selection errorSelection';

    // initially setting form validity to false in order to disable the submit button
    let formIsValid = false;

    // setting form validity to true if everything is okay so submit button is enabled if formIsValid is true
    if(enteredEmailIsValid && enteredNameIsValid && enteredPasswordIsValid && enteredOccupationIsValid 
    && enteredStateIsValid) formIsValid = true;

    // getting data from endpoint for our select-option html element
    useEffect(()=>{
        axios.get('https://frontend-take-home.fetchrewards.com/form')
        .then(response=>setData(response.data)).catch(error=>setErrorForGetMethod(error.message));
    },[]);

    // getting the precise data for our select-option html element
    const occupationData = data.occupations;
    const stateData = data.states;


    return (
        <>
        {errorForPostMethod &&  <div className='errorMessage'>Something went wrong!</div>}
        {successForPostMethod && <div className='successMessage'>Successfully posted!</div> }
        <form className='myform' onSubmit={submitHandler}>
            <label htmlFor='fullname' className='labels'>Enter your name</label>
            <input type='text' name='fullname' className={nameInputClass} value={enteredName} onChange={nameValueChangeHandler} onBlur={nameBlurHandler}/>
            {nameInputHasError && <p className='errorText'>Name field must be filled</p>}
            <label htmlFor='email' className='labels'>Enter email</label>
            <input type='email' name='email' className={emailInputClass} placeholder='example@mail.com' value={enteredEmail} onChange={emailValueChangeHandler} onBlur={emailBlurHandler}/>
             {emailInputHasError && <p className='errorText'>Enter a correct email address</p>}

             <label htmlFor='password' className='labels'>Enter password</label>
            <input type='password' name='password' className={passwordInputClass}
            value={enteredPassword} onChange={passwordValueChangeHandler} 
            onBlur={passwordBlurHandler}/>
            {passwordInputHasError && <p className='errorText'>Password field must be filled</p>}

            <label htmlFor='occupation' className='labels'>Select an occupation</label>
            <select className={occupationInputClass} name='occupation' value={enteredOccupation} onChange={occupationValueChangeHandler} onBlur={occupationBlurHandler}>
            {!errorForGetMethod ? <option value='Please Select One'>Please Select One</option> :   <option value='Please Select One'>Could not load the occupations data</option> }
                {occupationData?.map((occupation,i)=>(
                <option key={i} value={occupation}>{occupation}</option>
                ))}
            </select>
            {occupationInputHasError && <p className='errorText'>Please select an occupation</p>}

            <label htmlFor='states' className='labels'>Select a state</label>
           <select className={stateInputClass} name='states' value={enteredState} onChange={stateValueChangeHandler} onBlur={stateBlurHandler}>
               {!errorForGetMethod ? <option value='Please Select One'>Please Select One</option> :   <option value='Please Select One'>Could not load the states data</option> }
         
                {stateData?.map((state,i)=>(
                <option key={i} value={state.name} >{state.name}</option>
                ))}
            </select>
            {stateInputHasError && <p className='errorText'>Please select a state</p>}
            <button type='submit' disabled={!formIsValid} className='btnsave'>Submit</button>
        </form>
        </>
    )
}