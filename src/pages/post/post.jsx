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
  // useEffect(() => {
  //   if (showEvaluation) {
  //     fetchEvaluations();
  //   }
  // }, [showEvaluation]);
  
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
  const { title, content, username, useremail, createdAt, likes, loves, laughs, id, comments } = props

  const [recommendations, setRecommendations] = useState({likes, loves, laughs, userEmail: ""});
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationText, setEvaluationText] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [expandedEvaluations, setExpandedEvaluations] = useState({});

  const toggleEvaluationExpand = (name) => {
    setExpandedEvaluations((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const submitEvaluation = (id) => {
    if (evaluationText.trim() === '') return;
    const { username } = props.user
    const newComment = { name: username, content: evaluationText }
    let updateComment = comments
    updateComment.push(newComment)
    setRecommendations({...recommendations, comments: updateComment, id })
    setEvaluationText("")
  };
  // const [isRecommended, setIsRecommended] = useState(false);

  let location=useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 400;
  const shouldShowMore = content.length > previewLength;
  const displayContent = isExpanded ? content : content.slice(0, previewLength) + '...';

  const formattedContent = displayContent
  .replace(/\. /g, '.\n')
  .replace(/: /g, ':\n');


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
      }
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
        // alt={username}
        src="avatar/images.jfif"
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
      {/* <p className="text-gray-600 leading-relaxed text-left relative">
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
      </p> */}

      <div className="relative">
          <div 
            className={`text-gray-700 leading-relaxed ${
              !isExpanded ? 'line-clamp-3 pr-32' : ''
            }`}
          >
            <p className="whitespace-pre-line text-left">{formattedContent}</p>
          </div>
          
          {!isExpanded && (
            <div className="absolute bottom-0 right-0 inline-flex items-center bg-gradient-to-l from-white via-white to-transparent pl-12">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(true);
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Show More
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          )}
          
          {isExpanded && (
            <div className="flex justify-end mt-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsExpanded(false);
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                Show Less
                <ChevronUp className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
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

        {/* likes */}
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
            <span role="img" aria-label="thumbs up" style={{ fontSize: '20px' }}>👍</span>
            {/* <ThumbsUp  size={24} /> */}
            <span className="w-6 h-6 flex items-center justify-center text-sm text-blue-600 bg-white rounded-full">
              {recommendations.likes.length > 0 && (
                <span className="text-sm">{recommendations.likes.length}</span>
              )}
            </span>
          </div>

        {/* loves */}
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
            <span role="img" aria-label="heart" style={{ fontSize: '20px' }}>❤️</span>
            {/* <Heart className="text-red-500 fill-red-500" size={24}  /> */}
            <span className="w-6 h-6 flex items-center justif-ycenter text-sm text-red-600 bg-white rounded-full">
              {recommendations.loves.length > 0 && (
                <span className="text-sm">{recommendations.loves.length}</span>
              )}
            </span>
          </div>

        {/* laugh */}
          <div
            className={`flex items-center gap-1 cursor-pointer transition-colors ${
              useremail == loginUser ? 'pointer-events-none opacity-50' : 'hover:text-rose-500'
            }`}
            onClick={() => {
              if (useremail != loginUser) {
                handleRecommend(2, id);
              }
            }}
          >
             <span role="img" aria-label="smile" style={{ fontSize: '20px' }}>😃</span>
            {/* <Laugh size={24} /> */}
            <span className="w-6 h-6 flex items-center justif-ycenter text-sm text-rose-600 bg-white rounded-full">
              {recommendations.laughs.length > 0 && (
                <span className="text-sm">{recommendations.laughs.length}</span>
              )}
            </span>
          </div>
        </div>

        {/* comment */}
        <div className="flex items-center hover:text-gray-700 cursor-pointer" onClick={() => setShowEvaluation((prev) => !prev)}>
            <MessageCircle size={24} />
            <span className="w-6 h-6 flex items-center justify-center text-sm text-red-600 bg-white rounded-full">
              {comments.length > 0 && (
                <span className="text-sm">{comments.length}</span>
              )}
            </span>
            <span className="ml-1">comments</span>
          </div>
      </div>

      {/* Third aligned far right with spacing */}
      <div className="flex items-center gap-4 md:ml-auto md:mr-[50px]" id="third">
        <span>{readTime(createdAt)} ago</span>
        <span className="hover:text-gray-700">
          <Bookmark size={18} />
        </span>
      </div>
    </div>



    {showEvaluation && (

    <div className="bg-gray-50 rounded-md border-none p-4 mt-4 md:ml-10 md:mr-[50px]">
      {/* Evaluation List */}
      {comments.length > 0 ? (
      <ul className="mb-4 space-y-2">
        {comments.map((item, index) => (
          <li key={index} className="border-none p-2 rounded text-sm bg-white">
            {/* Avatar and Username */}
            <div className="flex items-center gap-3 mb-3">
              <img
                // src={author.avatar}
                // alt={author.name}
                src="avatar/images.jfif"
                className="w-8 h-8 rounded-full  md:ml-13 object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {/* <p className="text-sm text-gray-500">{format(createdAt.toDate(), 'MMM d')}</p> */}
              </div>
            </div>
            <div className="text-gray-700 whitespace-pre-line md:ml-30 w-3/4 text-left">{item.content}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 mb-4">No feedback yet. Be the first to comment!</p>
    )}

      {/* {comments.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {comments.map((item, index) => {
          const isExpanded = expandedEvaluations[item.name];
          const content = item.content;
          const preview = content.slice(0, 350);
          const shouldShowMore = content.length > 350;

          return (
            <li key={index} className="border p-3 rounded text-sm bg-white">
              <div className="font-medium text-gray-800 mb-1">{item.name}</div>
              <div className="text-gray-700 whitespace-pre-line">
                {isExpanded || !shouldShowMore ? content : preview + '...'}
              </div>
              {shouldShowMore && (
                <button
                  onClick={() => toggleEvaluationExpand(item.name)}
                  className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  {isExpanded ? 'Show Less ▲' : 'Show More ▼'}
                </button>
              )}
            </li>
          );
        })}
        </ul>
      ) : (
        <p className="text-gray-500 mb-4">No feedback yet. Be the first to comment!</p>
      )} */}

      

      {/* Evaluation Input */}
      <textarea
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={3}
        placeholder="Write your evaluation..."
        value={evaluationText}
        onChange={(e) => setEvaluationText(e.target.value)}
      />
      <button disabled={useremail == loginUser && true}
        onClick={() => {
          if (useremail != loginUser) {
            submitEvaluation(id);
          }
        }}
        className="mt-2 px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 text-sm"
      >
        Submit
      </button>
    </div>

)}


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

  

