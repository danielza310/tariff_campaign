import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { MessageCircle, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { auth, db } from "../../firebase"
import { collection , where, query, getDocs, startAfter , limit ,orderBy } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import {setUserData} from '../../store/actions/userActions';

// import "./post.css"

let lastVisible = null;
const Post = (props) => {
  const { title, content } = props
  let location=useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const previewLength = 500;
  const shouldShowMore = content.length > previewLength;
  const displayContent = isExpanded ? content : content.slice(0, previewLength) + '...';



  return (<>

  <article className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
        <img
          // src={author.avatar}
          // alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          {/* <h3 className="font-medium text-gray-900">{author.name}</h3>
          <p className="text-sm text-gray-500">{date}</p> */}
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight ml-10 text-left">
        {title}
      </h2>
      
      <div className="prose prose-sm max-w-none mb-4 ml-10">
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
      
      {/* <div className="flex flex-wrap gap-2 mb-4 ml-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div> */}
      
      <div className="flex items-center justify-between text-gray-500 text-sm ml-10">
        <button className="flex items-center gap-2 hover:text-gray-700">
          <MessageCircle size={18} />
          Add Comment
        </button>
        <div className="flex items-center gap-4">
          {/* <span>{readTime} read</span> */}
          <button className="hover:text-gray-700">
            <Bookmark size={18} />
          </button>
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
    keyword: state.post.keyword
  });
  
export default connect(
    mapStateToProps,
    { setUserData }
)(Post);
  

