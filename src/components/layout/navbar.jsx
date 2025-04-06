import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch  } from "react-icons/fa";
import { HiOutlineLogin, HiOutlineLogout  } from "react-icons/hi";
import { BsBell } from "react-icons/bs";
import { LuUserRound } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import {signOut } from "../../store/actions/userActions"
import {updatePost } from "../../store/actions/postActions"
import {updateBase } from "../../store/actions/baseActions"
import { auth, db } from "../../firebase"
import {collection,addDoc,serverTimestamp,where,query,onSnapshot,orderBy} from "firebase/firestore";
import logo from '../../assets/images/logo.png'

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

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
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  return (<>
     <nav className="fixed top-0 left-0 w-full bg-white h-[70px] flex z-50">
        <ul className='flex flex-row w-fit float-left'>
                <li>
                    <Link to="/" className="flex flex-row">
                        <div><img className="block w-[60px] ml-5" src={logo}/></div>
                        <div className='px-3 py-4 text-4xl font-[Inner] font-bold'><span className='text-[#ff0000]'>Tariff</span> <span className='text-[#163e64]'>Social</span></div>
                    </Link>
                </li>
                
            </ul>   
        <ul className='flex flex-row w-fit m-auto'>
           <li>
                {/* <Link className='relative' to="/chat">
                    <IoChatbox className='text-[40px] pt-2 text-sky-500 mr-3' />
                    {props.unreadmessages.filter(m=>m.from!='site').length!=0 && <div className='text-xs absolute top-[3px] left-0 w-4 bg-red-900 text-white border rounded-full'>
                        {props.unreadmessages.filter(m=>m.from!='site').length}</div>}
                </Link> */}
            </li>
        </ul>
        
            <ul className='flex flex-row  w-fit float-right'>
                <li>
                    <div className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-400 mt-5 mx-2 ${props.user.authenticated?'':'mr-6'}`}>
                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6 mr-2"><FaSearch /></div>
                        <input type="text" placeholder="Search related posts..." className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-800 focus:outline-none sm:text-sm/6 w-100 h-10"
                        onChange={(e)=>{
                            props.updatePost({keyword:e.target.value})
                        }}
                        />
                    </div>
                </li>
                {props.user.authenticated && <>
                <li className='mt-4'>
                    <Link className='relative' to="/notification">
                    <BsBell className='text-[40px] pt-2 text-gray-700'/> 
                    {props.unreadmessages.filter(m=>m.from=='site').length!=0 && <div className='text-xs absolute top-[3px] left-[0px] w-4 bg-red-900 text-white border rounded-full'>
                        {props.unreadmessages.filter(m=>m.from=='site').length}</div>}
                    </Link>
                </li>
                <li className='flex flex-row mr-5'>
                    <Tooltip title="Account settings">
                        <IconButton className='focus:outline-none! focus-visible:outline-none! ml-0!'
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                           <LuUserRound className='text-[40px] pt-2 text-gray-700' /> 
                            {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                        </IconButton>
                    </Tooltip>
                    <Menu id="account-menu" anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}
                        slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClose}>
                            <Avatar /> {props.user.username}
                        </MenuItem>
                        {/* <MenuItem onClick={handleClose}>
                        <Avatar /> My account
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                        </MenuItem> */}
                        <MenuItem onClick={()=>{
                            handleClose();
                            auth.signOut();
                            props.signOut();
                        }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Sign Out
                        </MenuItem> 
                    </Menu>
                    {/* <FaUser className='text-[40px] pt-2 text-sky-500' /> 
                    <div className='pt-4 mr-2 text-white'>{props.user.username}</div> */}
                </li>
                {/* <li>
                    <a href="#" onClick={()=>{
                        auth.signOut();
                        props.signOut();
                    }}><HiOutlineLogout className='text-[40px] pt-2 text-white mr-5' /></a>
                </li> */}
                </>}
             </ul>
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
  

