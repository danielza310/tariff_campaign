// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import store from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages'
import SignIn from './pages/sign/signin'
import NavBar from './components/layout/navbar'
import Authenticatie from './utils/authenticate'

let c=0;
function App() {

  // c++;
  // console.log("start app"+c);
  
  return (<>
    <Provider store={store}>
        <BrowserRouter>
          <Authenticatie>
            <NavBar/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn/>} />
            </Routes>
          </Authenticatie>
          </BrowserRouter>
    </Provider>    
    </>)
}

export default App
