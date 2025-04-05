import { useState } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { collection ,addDoc,serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
const CreatePost = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate(); // for programmatic navigation
  const create=async ()=>{
    if(title.trim()=="")
    {
        alert('Please input new post title.');
        return;
    }
    if(content.trim()=="")
        {
            alert('Please input new post title.');
            return;
        }
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            title, content , useremail:props.user.email,username:props.user.username, likes:[], loves:[], laughs:[], comments:[],
            createdAt: serverTimestamp(), // 👈 sets to current server time
        });
        navigate('/');
    } catch (error) {
        console.log(error)
        alert(error.message)
    }
  }
  return (<>
    <div className='w-full'>
    <div>
        <input type="text" className='w-full border-solid border border-sky-500 border-black h-8 my-3 text-4xl h-20 py-3 px-6' value={title} placeholder='New post title here....'
                onChange={(e)=>{setTitle(e.target.value)}}/>
    </div>
    <div>
        <textarea type="text" className='w-full border-solid border border-sky-500 border-black h-[60vh] py-3 px-6' value={content} placeholder='New post content here....'
                onChange={(e)=>{setContent(e.target.value)}}/>
    </div>
    
     <div className='flex flex-row w-full mb-5'>
        <div className='basis-128'></div>
        <div className='basis-256'>
            <button type='button' className='border-solid border !border-red-500 px-4 py-2' onClick={create}>Publish</button>
        </div>
        <div className='basis-128'></div>
     </div>
     </div>
    </>)
}

const mapStateToProps = (state) => ({
    user: state.user
  });
  
export default connect(
    mapStateToProps,
    { setUserData }
)(CreatePost);
  

