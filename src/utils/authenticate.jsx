import { useEffect } from 'react'
import { connect } from 'react-redux';
import { auth,db  } from "../firebase"
import {setUserData,signOut} from '../store/actions/userActions';
import {updateBase} from '../store/actions/baseActions';
import { doc ,getDoc} from "firebase/firestore";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {collection,query,where,orderBy,addDoc,onSnapshot,serverTimestamp} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

let signins=['/post/create','/chat']

const Authenticate =(props) => {
  const location = useLocation(); 
  const navigate = useNavigate(); // for programmatic navigation
  

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      // where('from', 'in', [currentUserId, recipientId]),
      // where('to', 'in', [currentUserId, recipientId]),
      orderBy('username')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) =>{
        return {id:doc.id,...doc.data()}
      } );
      // console.log(users)
      props.updateBase({users});
    });
    return () => {
      unsubscribe();
    }
  }, []);  
  
  // console.log(props.user);
  
  auth.onAuthStateChanged(() => {
    let currentUser=auth.currentUser;
    if(currentUser!==null && !props.user.authenticated)
      {
        const userRef = doc(db, "users",currentUser.uid);
        getDoc(userRef).then(userSnap=>{
          if (userSnap.exists()) {
            props.setUserData(userSnap.data())
          } 
        });
      }
      if(currentUser==null && props.user.authenticated)
      {
          props.signOut()
      }
  })
  if(!props.user.authenticated)
  {
    for(var i=0;i<signins.length;i++)
    {
      if(location.pathname.startsWith(signins[i]))
      {
        return <>Please signin... <Link to="/">Home</Link></>
      }
    }
  }
  return (<>
     {props.children}
     <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={props.loading}
        // onClick={()=>{props.updateBase({loading:false})}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>)
}
const mapStateToProps = (state) => ({
  user: state.user,
  loading:state.base.loading
});
  
export default connect(
    mapStateToProps,
    { setUserData,signOut, updateBase }
)(Authenticate);
  

