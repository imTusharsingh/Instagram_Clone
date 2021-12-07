import React, { createContext, useEffect, useReducer } from 'react';
import { Route } from "react-router-dom";
import ALLPOST from './components/ALLPOST';
import Hero from './components/hero';
import Loginpage from './components/loginpage';
import Profile from './components/profile';
import Signuppage from './components/signuppage';
import { reducer, initialState } from './reducers/userreducer';


export const Usercontext = createContext();



function App() {

  const [state, dispatch] = useReducer(reducer, initialState)


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }

  }, [])


  return (
    <>

      {!state ?
        <>
          <Usercontext.Provider value={{ state, dispatch }}>
          <Route exact path="/">
          <Loginpage />
            </Route>

            <Route  path="/allpost">
            <Loginpage />
            </Route>

            <Route path="/signup">
              <Signuppage />
            </Route>

            <Route path="/login">
              <Loginpage />
            </Route>


            <Route path="/profile/:username">
            <Loginpage />
            </Route>


          </Usercontext.Provider>

        </> :
        <>
          <Usercontext.Provider value={{ state, dispatch }}>


            <Route exact path="/">
              <Hero />
            </Route>

            <Route  path="/allpost">
              <ALLPOST />
            </Route>

            <Route path="/signup">
              <Signuppage />
            </Route>

            <Route path="/login">
              <Loginpage />
            </Route>


            <Route path="/profile/:username">
              <Profile />
            </Route>




          </Usercontext.Provider>


        
        </>}
    </>

  )
}

export default App;
