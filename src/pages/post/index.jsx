import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { doc, setDoc, getDoc, collection , where, query, getDocs, startAfter , limit ,orderBy, serverTimestamp } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import {updatePost } from "../../store/actions/postActions"
import { format } from 'date-fns';
import Post from './post';


let lastVisible = null;
const Posts = (props) => {

  let location=useLocation();
  const [posts, setPosts] = useState([]);

  // const getServerTime = async () => {
  //   const tempRef = doc(db, 'utils', 'server-time');
  
  //   // Write server timestamp
  //   await setDoc(tempRef, { time: serverTimestamp() });
  
  //   // Read back to get resolved timestamp
  //   const snapshot = await getDoc(tempRef);
  //   const serverTime = snapshot.data().time.toDate(); // Convert Firestore Timestamp to JS Date
  
  //   return serverTime;
  // }


  // useEffect(() => {
  //   const fetchServerTime = async () => {
  //     const serverTime = await getServerTime();
  //     props.updatePost({serverTime: "khkj"})
  //   };

  //   fetchServerTime();

  // }, [])


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
    snap.forEach(doc=>_posts.push({id:doc.id,...doc.data()}))
    setPosts(_posts)
  }
  return (<>
    {/* <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-10">
          {posts.map((article, index) => (
            <Post key={index} {...article} />
          ))}
        </div>
      </div> */}

      <div className="w-3/4 mx-auto py-8 px-4">
        <div className="space-y-6">
          {posts.map((article, index) => (
            <Post key={index} {...article } />
          ))}
        </div>
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
  

