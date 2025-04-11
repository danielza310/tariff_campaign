import { useState, useRef,useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { storage, db } from "../../firebase"
import { collection ,addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import {getDownloadURL,ref as storageRef,uploadBytes} from "firebase/storage";
var rte;
const CreatePost = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate(); // for programmatic navigation

  var refdiv=useRef(null);

  useEffect(()=>{
    setTimeout(function(){
        rte=new window.RichTextEditor(refdiv.current);
        rte.setHTMLCode("");
    },10)
},[])


  const handleChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      setImage(image);
    }
  };
  const create=async ()=>{
    if(title.trim()=="")
    {
        alert('Please input new post title.');
        return;
    }
    let content=rte.getHTMLCode();
    if(content.trim()=="")
        {
            alert('Please input new post title.');
            return;
        }
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            title, content , useremail:props.user.email,username:props.user.username, likes:[], loves:[], laughs:[], comments:[],image:image?image.name:"",
            createdAt: serverTimestamp(), // 👈 sets to current server time
        });
        // if(image)
        // {
        //     const imageRef = storageRef(storage, `products/${docRef.id}`);
        //     let result=await uploadBytes(imageRef, image)
        //     console.log(result);
        // }
        // navigate('/');
    } catch (error) {
        console.log(error)
    }
  }
  return (<>
    <div className='w-full'>
    <div>
        <input type="text" className='w-full border-solid border border-sky-500 border-black h-8 my-3 text-4xl h-20 py-3 px-6' value={title} placeholder='New post title here....'
                onChange={(e)=>{setTitle(e.target.value)}}/>
    </div>
    <div>
        <div ref={refdiv}></div>
        
        <hr/>
        {/* <textarea type="text" className='w-full border-solid border border-sky-500 border-black h-[60vh] py-3 px-6' value={content} placeholder='New post content here....'
                onChange={(e)=>{setContent(e.target.value)}}/> */}
    </div>
    {/* <div className="w-full text-left">
        <input label="Image" placeholder="Choose image" accept="image/png,image/jpeg" type="file" onChange={handleChange}/>
    </div> */}
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
  

