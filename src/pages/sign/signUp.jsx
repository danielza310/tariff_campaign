import { useState } from 'react'
import { connect } from 'react-redux';
import "./sign.css"
import { auth, db, app } from "../../firebase"
import {collection, doc ,getDoc, setDoc} from "firebase/firestore";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth"
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignUp = (props) => {
  const [updateDoc, setUpdateDoc] = useState({
    email: "", userName: "", password: "", cPassword: "",
  })

  const location = useLocation(); // access query params, pathname, etc.
  const navigate = useNavigate(); // for programmatic navigation

  const handleSignUp = async () => {
    if (updateDoc.password !== updateDoc.cPassword) {
        toast.error("Passwords do not match");
        return;
      }
    try {
        const userCredential=await createUserWithEmailAndPassword(auth, updateDoc.email, updateDoc.password)
        const user = userCredential.user;
        console.log('user', user)
        await setDoc(doc(db, "users", user.uid), {
          username: updateDoc.userName,
          email: user.email,
          createdAt: new Date(),
        });    
        await sendEmailVerification(user);
        toast("SignUp successfully!", { type: "success", position: "top-right" })
        navigate('/');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            toast.error('Email is already in use. Please use a different one or sign in.');
          } else if (error.code === 'auth/weak-password') {
            toast.error('Password should be at least 6 characters.');
          } else if (error.code === 'auth/invalid-email') {
            toast.error('Invalid email format.');
          } else {
            toast.error(error.message);
        }
    }
  }

  return (<>
    <ToastContainer />
    <div className="p-6 max-w-lg mx-auto bg-white rounded-md min-w-[500px] mt-[205px]">
      {/* Email Field */}
      <div className="flex flex-col md:flex-row items-center mb-6">
        <label className="w-full md:w-1/3 text-left pr-4 text-black">Email</label>
        <input
          type="email"
          className="w-full md:w-2/3 border border-sky-500 h-9 px-3 rounded outline-none focus:ring-1 focus:ring-sky-400"
          value={updateDoc.email}
          onChange={(e) => setUpdateDoc({ ...updateDoc, email: e.target.value })}
        />
      </div>

      {/* Name Field */}
      <div className="flex flex-col md:flex-row items-center mb-6">
        <label className="w-full md:w-1/3 text-left pr-4 text-black">Name</label>
        <input
          type="text"
          className="w-full md:w-2/3 border border-sky-500 h-9 px-3 rounded outline-none focus:ring-1 focus:ring-sky-400"
          value={updateDoc.userName}
          onChange={(e) => setUpdateDoc({ ...updateDoc, userName: e.target.value })}
        />
      </div>

      {/* Password Field */}
      <div className="flex flex-col md:flex-row items-center mb-6">
        <label className="w-full md:w-1/3 text-left pr-4 text-black">Password</label>
        <input
          type="password"
          className="w-full md:w-2/3 border border-sky-500 h-9 px-3 rounded outline-none focus:ring-1 focus:ring-sky-400"
          value={updateDoc.password}
          onChange={(e) => setUpdateDoc({ ...updateDoc, password: e.target.value })}
        />
      </div>

      {/* Confirm Password Field */}
      <div className="flex flex-col md:flex-row items-center mb-6">
        <label className="w-full md:w-1/3 text-left pr-4 text-black whitespace-nowrap">Confirm Password</label>
        <input
          type="password"
          className="w-full md:w-2/3 border border-sky-500 h-9 px-3 rounded outline-none focus:ring-1 focus:ring-sky-400"
          value={updateDoc.cPassword}
          onChange={(e) => setUpdateDoc({ ...updateDoc, cPassword: e.target.value })}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          type="button"
          className="px-6 py-2 rounded-md font-semibold border border-red-400 text-red-500 bg-red-50 hover:bg-red-100"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        <Link to="/signin">
          <button
            type="button"
            className="px-6 py-2 rounded-md font-semibold border border-sky-400 text-sky-500 bg-sky-50 hover:bg-sky-100"
          >
            Cancel
          </button>
        </Link>
      </div>
    </div>



    </>)
}

const mapStateToProps = (state) => ({
    data: state.data
  });
  
export default connect(
    mapStateToProps,
    { setUserData }
)(SignUp);
  

