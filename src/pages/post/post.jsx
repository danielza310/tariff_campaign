import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { MessageCircle, Bookmark, ChevronDown, ChevronUp, ThumbsUp, Heart,Laugh } from 'lucide-react';
import { auth, db } from "../../firebase"
import { doc, setDoc, getDoc, collection , where, query, getDocs, startAfter , limit ,orderBy, serverTimestamp } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';
import { updatePost, updateRecommendation } from "../../store/actions/postActions"

import { format, differenceInMinutes, parse  } from 'date-fns';


// import "./post.css"

let lastVisible = null;
const Post = (props) => {
  const [defaultTime, setDefaultTime] = useState(new Date())
  
  const getServerTime = async () => {
    const tempRef = doc(db, 'utils', 'server-time');
  
    // Write server timestamp
    await setDoc(tempRef, { time: serverTimestamp() });
  
    // Read back to get resolved timestamp
    const snapshot = await getDoc(tempRef);
    const serverTime = snapshot.data().time.toDate(); // Convert Firestore Timestamp to JS Date
  
    return serverTime;
  }

  useEffect(() => {
    getServerTime().then((time)=>{
      setDefaultTime(time)
    })
  }, [])

  const loginUser = props.user.email
  const { title, content, username, useremail, createdAt, likes, loves, laughs, id } = props
  const [recommendations, setRecommendations] = useState({likes, loves, laughs, userEmail: ""});
  // const [isRecommended, setIsRecommended] = useState(false);

  let location=useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 500;
  const shouldShowMore = content.length > previewLength;
  const displayContent = isExpanded ? content : content.slice(0, previewLength) + '...';

  const getTimeDifferenceString = (dateStr1, dateStr2) => {
    const date1 = new Date(dateStr1.replace(' ', 'T'));
    const date2 = new Date(dateStr2.replace(' ', 'T'));
  
    const diffMs = Math.abs(date2 - date1);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffHours >= 24) {
      return `${diffDays} day`;
    } else if (diffHours >= 1) {
      return `${diffHours} hr`;
    } else {
      return `${diffMins} min`;
    }
  }

  const readTime = (createdAt) => {
    const formatDTime = format(defaultTime, 'yyyy-MM-dd HH:mm:ss');
    const formatCTime = format(createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss');
    return getTimeDifferenceString(formatCTime, formatDTime)
  }

  const handleRecommend = (type, id) => {
    setRecommendations({ ...recommendations, id })
    if (type == 0) {
      if (!recommendations.likes.includes(loginUser)) {
        setRecommendations(prev => ({
          // count: prev.count + 1,
          ...prev,
          likes: [...prev.likes, loginUser]
        }));
      } else {
        setRecommendations(prev => ({
          // count: prev.count - 1,
          ...prev,
          likes: prev.likes.filter(person => person !== loginUser)
        }));
      }
    } else if (type == 1) {
      if (!recommendations.loves.includes(loginUser)) {
        setRecommendations(prev => ({
          ...prev,
          loves: [...prev.loves, loginUser]
        }));
      } else {
        setRecommendations(prev => ({
          ...prev,
          loves: prev.loves.filter(person => person !== loginUser)
        }));
        setIsRecommended(false);      }
    } else {
      if (!recommendations.laughs.includes(loginUser)) {
        setRecommendations(prev => ({
          ...prev,
          laughs: [...prev.laughs, loginUser]
        }));
      } else {
        setRecommendations(prev => ({
          ...prev,
          laughs: prev.laughs.filter(person => person !== loginUser)
        }));
      }
    }
  };

  useEffect(() => {
    props.updateRecommendation(recommendations)
  }, [recommendations])


  return (<>
  <article className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
    {/* Avatar and Username */}
    <div className="flex items-center gap-3 mb-4">
      <img
        // src={author.avatar}
        // alt={author.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium text-gray-900">{username}</h3>
        <p className="text-sm text-gray-500">{format(createdAt.toDate(), 'MMM d')}</p>
      </div>
    </div>

    {/* Title */}
    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight md:ml-10 text-left">
      {title}
    </h2>

    {/* Content Preview */}
    <div className="prose prose-sm max-w-none mb-4 md:ml-10">
      <p className="text-gray-600 leading-relaxed text-left relative">
        {displayContent}
        {!isExpanded && shouldShowMore && (
          <span className="inline-flex items-center absolute right-5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(true);
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[inherit] ml-1 font-medium"
            >
              Show More
              <ChevronDown size={16} />
            </a>
          </span>
        )}
        {isExpanded && shouldShowMore && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(false);
            }}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[inherit] ml-2 font-medium absolute right-5"
          >
            Show Less
            <ChevronUp size={16} />
          </a>
        )}
      </p>
    </div>

    {/* Reactions, Comments, Read Time */}
    <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-500 text-sm gap-4 md:gap-0 w-full">
      
      {/* First + Second with spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[50px] gap-2 md:ml-10">
        <div className="flex gap-6" id="first">
          {/* <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors" onClick={() => handleRecommend(0, useremail)}>
            <ThumbsUp size={24} />
            <span className="w-6 h-6 flex items-center justify-center text-sm text-red-600 bg-white rounded-full border-none">
              {recommendations.likes.length > 0 && (
                <span className="text-sm">{recommendations.likes.length}</span>
              )}
            </span>
          </div> */}

          <div
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              useremail == loginUser ? 'pointer-events-none opacity-50' : 'hover:text-blue-500'
            }`}
            onClick={() => {
              if (useremail != loginUser) {
                handleRecommend(0, id);
              }
            }}
          >
            <ThumbsUp size={24} />
            <span className="w-6 h-6 flex items-center justify-center text-sm text-red-600 bg-white rounded-full">
              {recommendations.likes.length > 0 && (
                <span className="text-sm">{recommendations.likes.length}</span>
              )}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              useremail == loginUser ? 'pointer-events-none opacity-50' : 'hover:text-red-500'
            }`}
            onClick={() => {
              if (useremail != loginUser) {
                handleRecommend(1, id);
              }
            }}
          >
            <Heart size={24} />
            <span className="w-6 h-6 flex items-center justif-ycenter text-sm text-red-600 bg-white rounded-full">
              {recommendations.loves.length > 0 && (
                <span className="text-sm">{recommendations.loves.length}</span>
              )}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              useremail == loginUser ? 'pointer-events-none opacity-50' : 'hover:text-red-500'
            }`}
            onClick={() => {
              if (useremail != loginUser) {
                handleRecommend(2, id);
              }
            }}
          >
            <Laugh size={24} />
            <span className="w-6 h-6 flex items-center justif-ycenter text-sm text-red-600 bg-white rounded-full">
              {recommendations.laughs.length > 0 && (
                <span className="text-sm">{recommendations.laughs.length}</span>
              )}
            </span>
          </div>

        </div>

        <div className="flex items-center hover:text-gray-700" id="second">
          <MessageCircle size={18} />
          comments
        </div>
      </div>

      {/* Third aligned far right with spacing */}
      <div className="flex items-center gap-4 md:ml-auto md:mr-[50px]" id="third">
        <span>{readTime(createdAt)} read</span>
        <span className="hover:text-gray-700">
          <Bookmark size={18} />
        </span>
      </div>
    </div>
</article>


    {/* <div className='w-full px-10 py-3'>
        <div>{props.title}</div>
        <div><pre>{props.content}</pre></div>
     </div> */}
    </>)
}

const mapStateToProps = (state) => ({
    user: state.user,
    post: state.post,
    keyword: state.post.keyword
  });
  
export default connect(
    mapStateToProps,
    { setUserData, updatePost, updateRecommendation }
)(Post);
  

