import { useState, useEffect } from 'react'
import { format, differenceInMinutes, parse  } from 'date-fns';
import { LuUserRound } from "react-icons/lu";

const SocialPostCard = (props) => {
    const [defaultTime, setDefaultTime] = useState(new Date())
    const { title, content, username, useremail, createdAt, likes, loves, laughs, id, comments } = props

    const getServerTime = async () => {
        const tempRef = doc(db, 'utils', 'server-time');
      
        // Write server timestamp
        await setDoc(tempRef, { time: serverTimestamp() });
      
        // Read back to get resolved timestamp
        const snapshot = await getDoc(tempRef);
        const serverTime = snapshot.data().time.toDate(); // Convert Firestore Timestamp to JS Date
      
        return serverTime;
      }
    
    const getTimeDifferenceString = (dateStr1, dateStr2) => {
        const date1 = new Date(dateStr1.replace(' ', 'T'));
        const date2 = new Date(dateStr2.replace(' ', 'T'));
    
        const diffMs = Math.abs(date2 - date1);
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
        if (diffHours >= 24) {
        return `${diffDays} d`;
        } else if (diffHours >= 1) {
        return `${diffHours} h`;
        } else {
        return `${diffMins} m`;
        }
    }

    const readTime = (createdAt) => {
        const formatDTime = format(defaultTime, 'yyyy-MM-dd HH:mm:ss');
        const formatCTime = format(createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss');
        return getTimeDifferenceString(formatCTime, formatDTime)
    }



  return (
    <>
        <div className="max-w-md w-full bg-white border rounded-md shadow-sm p-4 space-y-4 text-sm mb-5">
            {/* Post Content */}
            <div className="border-none space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 mb-1">
                        {/* <img
                        // src={author.avatar}
                        // alt={username}
                        src="avatar/images.jfif"
                        className="w-7 h-7 rounded-full object-cover"
                        /> */}
                        <LuUserRound className='text-4xl text-gray-700' /> 
                        <div>
                        <h3 className="font-medium text-gray-900">{username}</h3>
                        <p className="text-sm text-gray-500">{readTime(createdAt)}</p>
                    </div>
                </div>
                    <div className="text-gray-500 text-lg font-bold cursor-pointer">⋯</div>
                </div>
                <p className='text-[18px] font-bold text-gray-900 mb-3 leading-tight text-left ml-5'>{title}</p>

                {/* <div className="w-full bg-gray-100 h-24 rounded flex items-center justify-center text-gray-400">
                🫖
                </div> */}

                <div className="flex items-center gap-6 text-gray-600 text-sm pt-2">
                {/* 👍 Like */}
                <div className="flex items-center gap-1">
                    <span role="img" aria-label="thumbs up" className="text-xl">👍</span>
                    <span className="w-6 h-6 flex items-center justify-center text-sm text-blue-600 bg-white rounded-full">
                    {likes.length > 0 && <span>{likes.length}</span>}
                    </span>
                </div>

                {/* ❤️ Love */}
                <div className="flex items-center gap-1">
                    <span role="img" aria-label="heart" className="text-xl">❤️</span>
                    <span className="w-6 h-6 flex items-center justify-center text-sm text-red-600 bg-white rounded-full">
                    {loves.length > 0 && <span>{loves.length}</span>}
                    </span>
                </div>

                {/* 😃 Laugh */}
                <div className="flex items-center gap-1">
                    <span role="img" aria-label="smile" className="text-xl">😃</span>
                    <span className="w-6 h-6 flex items-center justify-center text-sm text-yellow-600 bg-white rounded-full">
                    {laughs.length > 0 && <span>{laughs.length}</span>}
                    </span>
                </div>

                {/* <button className="ml-auto text-sm text-gray-700 hover:underline">
                    Comment
                </button> */}
                </div>
            </div>
            
            </div>
    </>
    

    
  );
};

export default SocialPostCard;
