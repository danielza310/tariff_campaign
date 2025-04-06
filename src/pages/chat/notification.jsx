import { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./chat.css";
import { auth, db } from "../../firebase";
import {collection,addDoc,serverTimestamp,where,query,getDocs,orderBy,updateDoc,doc} from "firebase/firestore";
import { setUserData } from "../../store/actions/userActions";
import { AiOutlineUser } from "react-icons/ai";
const Notification = (props) => {
  const [messages,setMessages]=useState([]);
  const remove_message=async ()=>{
    
  }
  useEffect(() => {
    if(!props.user.authenticated) return;
      setMessages(props.unreadmessages.filter(m=>m.from=="site"))
      console.log(props.unreadmessages);
      props.unreadmessages.filter(m=>m.from=="site").forEach(message => {
        const msg = doc(db, "messages", message.id);
        updateDoc(msg, { read:1}).then((res) => {
        })
      });
  }, [props.user.authenticated]);  
  return (
    <>
      <div className="flex flex-row w-full">
          <div className="w-full">
            {messages.map((message,index)=><div key={index} className={`w-96/100 rounded-md border-solid border border-sky-400 m-3 px-3 py-4 text-left`} >{message.message}</div>)}
          </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  users: state.base.users,
  unreadmessages: state.base.unreadmessages,
  user: state.user,
});

export default connect(mapStateToProps, { setUserData })(Notification);
