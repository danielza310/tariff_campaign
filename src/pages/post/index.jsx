import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { collection , where, query, getDocs, startAfter , limit ,orderBy } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import Post from './post';
let lastVisible = null;
const Posts = (props) => {
  let location=useLocation();
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    search();
  },[location.pathname,props.keyword])
  const search=async ()=>{
    /*
    🔧 Supported comparison operators:
        "==", "!="
        "<", "<=", ">", ">="
        "in", "not-in", "array-contains", "array-contains-any"
    const q1 = query(collection(db, "posts"), where("title", "contains", props.keyword));
    const q2 = query(collection(db, "posts"), where("content", "contains", props.keyword));
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const mergedDocsMap = new Map();
    snap1.forEach(doc => mergedDocsMap.set(doc.id, doc.data()));
    snap2.forEach(doc => mergedDocsMap.set(doc.id, doc.data())); // overwrites if same id
    const mergedDocs = Array.from(mergedDocsMap.entries()).map(([id, data]) => ({ id, ...data }));
    console.log(mergedDocs);

    import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";

    // Step 1: Get the cursor document (e.g., the 10th one)
    const firstBatch = await getDocs(query(collection(db, "cities"), orderBy("name"), limit(10)));
    const lastVisible = firstBatch.docs[firstBatch.docs.length - 1]; // this is your cursor

    // Step 2: Use `startAfter()` to skip the first 10 and get the next 10
    const nextBatch = await getDocs(
    query(collection(db, "cities"), orderBy("name"), startAfter(lastVisible), limit(10))
    );


    */
    const q = lastVisible==null?query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10)):query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(null), limit(10));
    const snap = await getDocs(q);
    let _posts=[]
    snap.forEach(doc=>_posts.push(doc.data()))
    setPosts(_posts)
  }
  return (<>
    <div className='w-full'>
        {posts.map((p)=><Post {...p}/>)}
     </div>
    </>)
}

const mapStateToProps = (state) => ({
    keyword: state.post.keyword
  });
  
export default connect(
    mapStateToProps,
    { setUserData }
)(Posts);
  

