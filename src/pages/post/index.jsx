import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { doc, setDoc, getDoc, collection , where, query, getDocs, startAfter , limit ,orderBy, serverTimestamp } from "firebase/firestore";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import {updatePost } from "../../store/actions/postActions"
import { format } from 'date-fns';
import Post from './post';
import SocialPostCard from './postcard';


let lastVisible = null;
const Posts = (props) => {

  let location=useLocation();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 

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
        {/* <div>
          <div className="w-1/2 mx-auto py-8 px-4">
            <div className="space-y-6">
              {posts.map((article, index) => (
                <Post key={index} {...article } />
              ))}
            </div>
          </div>
        </div> */}


      <div className="flex flex-col md:flex-row w-full px-4 py-8 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col items-start w-full md:w-[16%] md:ml-4 bg-white rounded-lg p-4 shadow-sm">
          {/* Button section */}
          <div className="mt-12 w-full flex flex-col items-center gap-2">
            <button className="w-full text-blue-600 border border-blue-600 rounded px-4 py-2 text-sm hover:bg-blue-50" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className="w-full text-blue-700 bg-blue-50 rounded px-4 py-2 text-sm hover:bg-blue-100" onClick={() => navigate("/signin")}>
              Sign in
            </button>
          </div>

          <ul className="w-full space-y-2 text-sm text-gray-700 mt-5">
            {[
              { label: "Home", icon: "🏠" },
              { label: "About", icon: "ℹ️" },
              { label: "DMs", icon: "💬" },
              { label: "T & C", icon: "📃" },
              { label: "Privacy", icon: "🔒" },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 w-full px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-100"
              >
                <span className='ml-5'>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>


        {/* Main Post Content */}
        <main className="w-full md:w-3/5">
          <div className="space-y-6">
            {posts.map((article, index) => (
              <Post key={index} {...article} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden md:block w-full md:w-1/5 bg-white rounded-lg p-4 shadow-sm">
            {/* <div className="flex flex-col gap-2">
                <input
                type="text"
                placeholder="Post something..."
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="flex justify-end items-center gap-2">
                <button className="border rounded px-2 py-1 text-sm">+</button>
                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                    Post
                </button>
                </div>
            </div> */}

            {/* Trending Section */}
            <div>
              <p className="text-gray-600 mb-1 flex items-center gap-1">
                🔥 <span>Trending Today:</span>
                </p>
                {/* <div className="flex gap-3 text-blue-600 font-medium">
                <a href="#" className="hover:underline">#BrexitDrama</a>
                <a href="#" className="hover:underline">#KoalaTok</a>
                </div> */}
            </div>
             
          {posts.map((article, index) => (
            <SocialPostCard key={index} {...article} />
          ))}
        </aside>
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
  

