import { connect } from 'react-redux';
import { auth,db  } from "../firebase"
import {setUserData,signOut} from '../store/actions/userActions';
import { doc ,getDoc} from "firebase/firestore";

const Authenticate =(props) => {
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
  return (<>
     {props.children}
    </>)
}
const mapStateToProps = (state) => ({
  user: state.user
});
  
export default connect(
    mapStateToProps,
    { setUserData,signOut }
)(Authenticate);
  

