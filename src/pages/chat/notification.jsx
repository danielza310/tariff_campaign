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
    const q = query(
      collection(db, 'messages'),
      where('from', '==', "site"),
      where('to', '==', props.user.email),
      orderBy('read'),
      orderBy('timestamp')
    );
    let _messages=[]
    getDocs(q).then(snap=>{
      snap.docs.forEach(doc1=>{
        let data=doc1.data();
        const msg = doc(db, "messages", doc1.id);
        updateDoc(msg, { read:1}).then((res) => {
        })
        _messages.push({id:doc1.id,...data})
      })
      setMessages(_messages)
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
