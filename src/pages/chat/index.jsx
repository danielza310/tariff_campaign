import { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./chat.css";
import { auth, db } from "../../firebase";
import {collection,addDoc,serverTimestamp,where,query,onSnapshot,orderBy} from "firebase/firestore";
import { setUserData } from "../../store/actions/userActions";
import { AiOutlineUser } from "react-icons/ai";
const Chat = (props) => {
  const [selectedUser,setSelectedUser]=useState('');
  const [msg,setMsg]=useState('');
  const [messages,setMessages]=useState([]);
  const select_user=(user)=>{
    setSelectedUser(user.email)
  }
  const send_message=async ()=>{
    if(select_user=="") return;
    await addDoc(collection(db, 'messages'), {
      from: props.user.email ,
      to: selectedUser,
      message:msg,
      read:0,
      timestamp: serverTimestamp(),
    });
  }
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('from', 'in', [selectedUser, props.user.email]),
      where('to', 'in', [selectedUser, props.user.email]),
      orderBy('timestamp')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) =>{
        return doc.data()
      } );
      setMessages(data)
      console.log(data);
      
    });
    return () => {
      unsubscribe();
    }
  }, [selectedUser]);  
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="basis-1/5 min-w-[120px] rounded-md border-solid border border-sky-400 m-3" style={{height:'calc(100vh - 90px) '}}>
          {props.users.map((user, index) => (
            user.email==props.user.email?null:
            <div key={index} className={`chat-user flex flex-row cursor-pointer focus:bg-sky-400 h-[40px] p-2 text-lg ${user.email==selectedUser?'bg-sky-400':' hover:bg-sky-200'}`} onClick={()=>select_user(user)}>
              <AiOutlineUser className="my-1 mx-2" />
              <div>{user.username}</div>
            </div>
          ))}
        </div>
        <div className="basis-4/4 ">
          <div className="w-96/100 rounded-md border-solid border border-sky-400 mt-3 mb-[10px]" style={{height:'calc(100vh - 140px) '}}>
            {messages.map((message,index)=><div key={index} className={`w-3/5 px-2 py-1 ${message.from==selectedUser?'float-left text-left':'float-right text-right'}`} >{message.message}</div>)}
          </div>
          <div>
            <div className="w-full text-left h-[40px]">
              <input type="text" placeholder="Type your message..." className="w-96/100 border-sky-400 border border-solid h-full p-2" value={msg}
                onChange={(e)=>{setMsg(e.target.value)}} onKeyDown={(e)=>e.keyCode==13 && send_message()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  users: state.base.users,
  user: state.user,
});

export default connect(mapStateToProps, { setUserData })(Chat);
