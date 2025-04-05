import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { collection , where, query, getDocs, startAfter , limit ,orderBy } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
let lastVisible = null;
const Post = (props) => {
  let location=useLocation();
  
  return (<>
    <div className='w-full px-10 py-3'>
        <div>{props.title}</div>
        <div><pre>{props.content}</pre></div>
     </div>
    </>)
}

const mapStateToProps = (state) => ({
    keyword: state.post.keyword
  });
  
export default connect(
    mapStateToProps,
    { setUserData }
)(Post);
  

