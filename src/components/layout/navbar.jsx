import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { HiOutlineLogin, HiOutlineLogout  } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import {signOut } from "../../store/actions/userActions"
import { auth } from "../../firebase"
const Navbar = (props) => {
    console.log(props.user);
    
  return (<>
     <nav className="fixed top-0 left-0 w-full bg-sky-500/100 h-[50px] flex">
        <ul className='flex flex-row w-fit m-auto'>
            <li>
                <Link to="/"><FaHome className='text-[40px] pt-2 text-white mr-3' /></Link>
            </li>
        </ul>
        {!props.user.authenticated?<>
            <ul className=' w-fit float-right'>
                <li>
                    <Link to="/signin"><HiOutlineLogin className='text-[40px] pt-2 text-white mr-3' /></Link>
                </li>
            </ul>
        </>:<>
            <ul className='flex flex-row  w-fit float-right'>
                <li className='flex flex-row'>
                    <Link className='!border-sky-1000 text-sky-900  h-[40px] mt-[5px] !py-[6px] px-5 rounded-lg  mr-10 bg-white' to="/post/create">Create Post</Link>
                </li>
                <li className='flex flex-row'>
                    <FaUser className='text-[40px] pt-2 text-white' /> 
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
    user: state.user
  });
  
export default connect(
    mapStateToProps,
    { signOut }
)(Navbar);
  

