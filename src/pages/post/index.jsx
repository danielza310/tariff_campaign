import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import "./post.css"
import { auth, db } from "../../firebase"
import { doc, setDoc, getDoc, collection , where, query, getDocs, startAfter , limit ,orderBy, serverTimestamp } from "firebase/firestore";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {setUserData , signOut} from '../../store/actions/userActions';
import {updateBase } from "../../store/actions/baseActions"
import { format } from 'date-fns';
import Post from './post';
import SocialPostCard from './postcard';
import Slider from "react-slick";


let lastVisible = null;
const Posts = (props) => {

  let location=useLocation();
  const [posts, setPosts] = useState([]);
  const [trendPosts, setTrendPosts] = useState([])
  const navigate = useNavigate(); 
  const [isFetching, setIsFetching] = useState(false);

  useEffect(()=>{
    setPosts([]);
    setIsFetching(false);
    lastVisible=null;
    search();
  },[location.pathname,props.keyword])

  const handleScroll = () => {
    // console.log("scroll",window.innerHeight,document.documentElement.scrollTop,document.documentElement.offsetHeight,isFetching );
    if (
      window.innerHeight + document.documentElement.scrollTop
      >= document.documentElement.offsetHeight - 100
      && !isFetching
    ) {
      setIsFetching(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (isFetching) {
      search();
    }
  }, [isFetching]);


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
    let _posts=[];
    props.updateBase({loading:true})
    while(_posts.length<4)
    {
      const q = lastVisible==null?query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(4)):query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(4));
      const snap = await getDocs(q);
      let c=0;
      snap.forEach(doc=>{
        let data=doc.data();
        if(props.keyword!="" && data.title.indexOf(props.keyword)<0 && data.content.indexOf(props.keyword)<0) return
        c++;
        lastVisible=doc
        _posts.push({id:doc.id,...data})
      })
      if(c==0) break;
    }
    let trendingPosts=[...posts,..._posts]
    setPosts([...posts,..._posts])
    if(_posts.length!=0) setIsFetching(false);
    trendingPosts.sort((a, b) => {
      let recommendA = Number(a.likes.length + a.loves.length + a.laughs.length)
      let recommendB= Number(b.likes.length + b.loves.length + b.laughs.length)
      return recommendB - recommendA
    })
    setTrendPosts(trendingPosts)
    props.updateBase({loading:false})
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
  };
  return (<>
     
      <div className="flex flex-col md:flex-row w-full px-4 py-8 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:flex flex-col items-start w-full md:w-[16%] md:ml-4 rounded-lg p-4 shadow-sm">
          {/* Button section */}
          <div className="mt-12 w-full flex flex-col items-center gap-2 space-y-2">
          {props.user.authenticated?<>
            <button className="w-full  md:w-3/4 text-blue-700 bg-blue-600 hover:bg-blue-700 font-semibold rounded px-4 py-2 signup"
              onClick={() => navigate("/post/create")}>
              Create Post
            </button>
            <button className="w-full md:w-3/4 border-none text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-500 signin" style={{backgroundColor: 'white'}}
             onClick={() => {
              auth.signOut();
              props.signOut();
             }}>
              Sign Out
            </button>
          </>:<>
            <button className="w-full  md:w-3/4 text-blue-700 bg-blue-600 hover:bg-blue-700 font-semibold rounded px-4 py-2 signup"
              onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className="w-full md:w-3/4 border-none text-gray-700 rounded px-4 py-2 text-sm hover:bg-gray-500 signin" style={{backgroundColor: 'white'}}
             onClick={() => navigate("/signin")}>
              Sign in
            </button>
          </>}
            
          </div>

          <ul className="w-full space-y-2 text-sm text-gray-700 mt-5">
            {[
              { label: "Home", icon: "🏠" },
              { label: "About", icon: "ℹ️" },
              { label: "DMs", icon: "💬", url: "/chat" },
              { label: "T & C", icon: "📃", url: "/info/tc" },
              { label: "Privacy", icon: "🔒", url: "/info/privacy" },
            ].map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 w-full px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-100 relative"
                onClick={() => navigate(item.url)}
              >
                <span className='ml-5'>{item.icon}</span>
                <span>{item.label}</span>
                {item.label=="DMs" && props.unreadmessages.filter(m=>m.from!='site').length!=0 && <div className='text-xs absolute top-[8px] left-24 w-4 bg-red-900 text-white border rounded-full'>
                  {props.unreadmessages.filter(m=>m.from!='site').length}</div>}
              </li>
            ))}
          </ul>
        </aside>


        {/* Main Post Content */}
        <main className="w-full md:w-3/5">
          <Slider {...settings}>
          <img  src="/assets/images/advertication/1.png"/>
          <img  src="/assets/images/advertication/2.png"/>
          <img  src="/assets/images/advertication/3.png"/>
          </Slider>
          {/* <Carousel {...carousel_setting}  className="adCarousel"
            >
               <Paper className="Project"  elevation={10}><img  src="/assets/images/advertication/1.png"/></Paper>
               <Paper className="Project" elevation={10}><img  src="/assets/images/advertication/2.png"/></Paper>
               <Paper className="Project" elevation={10}><img  src="/assets/images/advertication/3.png"/></Paper>
          </Carousel>*/}
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
             
          {trendPosts.map((article, index) => (
            <SocialPostCard key={index} {...article} />
          ))}
        </aside>
      </div>

    </>)
}

const mapStateToProps = (state) => ({
    keyword: state.post.keyword,
    unreadmessages: state.base.unreadmessages,
    user: state.user
  });
  
export default connect(
    mapStateToProps,
    { setUserData, signOut, updateBase }
)(Posts);
  

