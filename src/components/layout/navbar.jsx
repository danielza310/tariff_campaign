import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch  } from "react-icons/fa";
import { HiOutlineLogin, HiOutlineLogout  } from "react-icons/hi";
import { BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import {signOut } from "../../store/actions/userActions"
import {updatePost } from "../../store/actions/postActions"
import {updateBase } from "../../store/actions/baseActions"
import { auth, db } from "../../firebase"
import {collection,addDoc,serverTimestamp,where,query,onSnapshot,orderBy} from "firebase/firestore";
import logo from '../../assets/images/logo.png'
const Navbar = (props) => {
    useEffect(() => {
        if(props.user.authenticated)
        {
            const q = query(
                collection(db, 'messages'),
                where('to', '==', props.user.email),
                where('read', '==', 0),
                orderBy('timestamp')
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) =>{
                    return {id:doc.id,...doc.data()}
                });
                // console.log(data);                
                props.updateBase({unreadmessages:data})
            });
            return () => {
                unsubscribe();
            }
        }
    }, [props.user.authenticated]);  
    
  return (<>
     <nav className="fixed top-0 left-0 w-full bg-white h-[70px] flex z-50">
        <ul className='flex flex-row w-fit float-left'>
                <li>
                    <div className="flex flex-row">
                        <div><img className="block w-[60px] mx-3" src={logo}/></div>
                        <div className='px-3 py-4 text-4xl font-[Inner] font-bold'><span className='text-[#ff0000]'>Tariff</span> <span className='text-[#163e64]'>Social</span></div>
                    </div>
                </li>
                <li>
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-400 my-2 mx-2">
                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 mr-2"><FaSearch /></div>
                        <input type="text" placeholder="Search related posts..." className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                        onChange={(e)=>{
                            props.updatePost({keyword:e.target.value})
                        }}
                        />
                    </div>
                </li>
            </ul>   
        <ul className='flex flex-row w-fit m-auto'>
            <li>
                <Link to="/"><FaHome className='text-[40px] pt-2 text-blue mr-3' /></Link>
            </li>
            <li>
                <Link className='relative' to="/chat">
                    <IoChatbox className='text-[40px] pt-2 text-blue mr-3' />
                    {props.unreadmessages.filter(m=>m.from!='site').length!=0 && <div className='text-xs absolute top-[3px] left-0 w-4 bg-red-900 text-white border rounded-full'>
                        {props.unreadmessages.filter(m=>m.from!='site').length}</div>}
                </Link>
            </li>
        </ul>
        {!props.user.authenticated?<>
            <ul className=' w-fit float-right'>
                <li>
                    <Link to="/signin"><HiOutlineLogin className='text-[40px] pt-2 text-blue mr-3' /></Link>
                </li>
                
            </ul>
        </>:<>
            <ul className='flex flex-row  w-fit float-right'>
                <li className='flex flex-row'>
                    <Link className='!border-sky-1000 text-sky-900  h-[40px] mt-[5px] !py-[6px] px-5 rounded-lg  mr-10 bg-white' to="/post/create">Create Post</Link>
                </li>
                <li>
                    <Link className='relative' to="/notification">
                    <BsBellFill className='text-[40px] pt-2 text-blue' /> 
                    {props.unreadmessages.filter(m=>m.from=='site').length!=0 && <div className='text-xs absolute top-[3px] left-[0px] w-4 bg-red-900 text-white border rounded-full'>
                        {props.unreadmessages.filter(m=>m.from=='site').length}</div>}
                    </Link>
                </li>
                <li className='flex flex-row'>
                    <FaUser className='text-[40px] pt-2 text-blue' /> 
                    <div className='pt-4 mr-2 text-white'>{props.user.username}</div>
                </li>
                <li>
                    <a href="#" onClick={()=>{
                        auth.signOut();
                        props.signOut();
                    }}><HiOutlineLogout className='text-[40px] pt-2 text-white mr-5' /></a>
                </li>
            </ul>
        </>}
     </nav>
     
    </>)
}

const mapStateToProps = (state) => ({
    user: state.user,
    unreadmessages: state.base.unreadmessages
  });
  
export default connect(
    mapStateToProps,
    { signOut , updatePost, updateBase  }
)(Navbar);
  

