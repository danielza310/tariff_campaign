// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import store from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Home from './pages'
import Posts from './pages/post'
import SignIn from './pages/sign/signin'
import SignUp from './pages/sign/signUp'
import CreatePost from './pages/post/create'
import NavBar from './components/layout/navbar'
import Authenticatie from './utils/authenticate'

function App() {
  // navigator.serviceWorker
  // .register('/firebase-messaging-sw.js')
  // .then((registration) => {
  //   console.log('Service Worker registered:', registration);
  // });

return (<>
    <Provider store={store}>
        <BrowserRouter>
          <Authenticatie>
            <NavBar/>
            <Routes>
              <Route path="/" element={<Posts />} />
              <Route path="/signin" element={<SignIn/>} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/post/create" element={<CreatePost/>} />
            </Routes>
          </Authenticatie>
        </BrowserRouter>
    </Provider>    
    </>)
}

export default App
