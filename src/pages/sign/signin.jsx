import { useState } from 'react'
import { connect } from 'react-redux';
import "./sign.css"
import { auth, db, app } from "../../firebase"
import {collection, doc ,getDoc} from "firebase/firestore";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import { Link } from 'react-router-dom';

const SignIn = (props) => {
  const [email, setEmail] = useState("danielza310@gmail.com");
  const [password, setPassword] = useState("111111");
  const location = useLocation(); // access query params, pathname, etc.
  const navigate = useNavigate(); // for programmatic navigation
  const signin=()=>{
    signInWithEmailAndPassword(auth, email, password).then(async () => {
        let currentUser=auth.currentUser;
        const userRef = doc(db, "users",currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            props.setUserData(userSnap.data())
            navigate("/");
        } 
    }).catch ((error) => {
        console.log("error")
        alert(error)
    })
  }
  const signup = () => {
    navigate("/singup")
  }

  return (<>
    <div className='sign_div'>
     <div className='flex flex-row mb-5'>
        <div className='basis-64 pt-1 text-left'>Email</div>
        <div className='basis-192'>
            <input type="text" className='w-full border-solid border border-sky-500 border-black h-8' value={email}
                onChange={(e)=>{setEmail(e.target.value)}}/>
        </div>
     </div>
     <div className='flex flex-row mb-5'>
        <div className='basis-64 pt-1 text-left'>Password</div>
        <div className='basis-192'>
            <input type="password" className='w-full border-solid border border-sky-500 border-black h-8' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>
     </div>
     <div className='flex flex-row mb-5'>
        <div className='basis-64'></div>
        <div className='basis-64'>
            <button type='button' className='border-solid border !border-red-500 px-4 py-2' onClick={signin}>SignIn</button>
        </div>
        <div className='basis-64'>
            <Link to="/signup"><button type='button' className='border-solid border !border-sky-500 px-4 py-2'>SignUp</button></Link>
        </div>
        <div className='basis-64'></div>
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
)(SignIn);
  

