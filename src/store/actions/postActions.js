import {
  UPDATE_POST_STORE,
} from '../types';

import { doc, updateDoc, arrayUnion, arrayRemove,  collection , addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"


export const updatePost = (data) => (dispatch) => {
  dispatch({ type: 
    UPDATE_POST_STORE, payload:data });
};

export const updateRecommendation = (recommendations,info) => (dispatch,getstate) => {
  return new Promise((res, rej) => {
        let notice="";
        const {type,evaluationText}=info
        const {email,username}=getstate().user;
        const {title,id}=recommendations;
        const post = doc(db, "posts", id);

        if (type == "like" || type == "love" || type == "laugh" || type == "follow") {
          const post = doc(db, "posts", id);
          if (!recommendations[`${type}s`].includes(email)) {
            notice=`${username} reacted to the post ${title} with a ${type} reaction.`;
            updateDoc(post, {
              [`${type}s`]: arrayUnion(email)
            }).then(async ()=>{
              recommendations={...recommendations,[`${type}s`]: [...recommendations[`${type}s`],email]}
              await addDoc(collection(db, 'messages'), {
                          from: "site" ,
                          to: recommendations.useremail,
                          message:notice,
                          read:0,
                          timestamp: serverTimestamp(),
                        });
              res(recommendations)
            });
          } else {
            notice=`${username} removed the  ${type} reaction from the post ${title}`;
            updateDoc(post, {
              [`${type}s`]: arrayRemove(email)
            }).then(async ()=>{
              recommendations={...recommendations,[`${type}s`]:recommendations[`${type}s`].filter(person => person !== email)}
              await addDoc(collection(db, 'messages'), {
                from: "site" ,
                to: recommendations.useremail,
                message:notice,
                read:0, type,
                timestamp: serverTimestamp(),
              });
              res(recommendations)
            });
          }
        }
        else if(type=="comment"){
          notice=`${username} made a new comment under the post ${title}.`;
          updateDoc(post, {
            comments: arrayUnion({ name: username, content: evaluationText })
          }).then(async ()=>{
            recommendations={...recommendations,comments: [...recommendations.comments,{ name: username, content: evaluationText }]}
            let users=[recommendations.useremail,...recommendations.follows.filter(e=>e!=email)]
            console.log(users);
            
            for(var i=0;i<users.length;i++)
            {
              await addDoc(collection(db, 'messages'), {
                from: "site" ,
                to: users[i],
                message:notice,
                read:0, type, comment:evaluationText,
                timestamp: serverTimestamp(),
              });
            }
            res(recommendations)
          });
        } 
  });
};  
