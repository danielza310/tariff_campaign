import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from 'react-router-dom';
  
const MarkDown = (props) => {
  const [content, setContent] = useState("");
  const { md } = useParams(); 
  useEffect(() => {
    fetch(`/${md}.md`)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return <div className="text-left px-10 py-3"><ReactMarkdown >{content}</ReactMarkdown></div>;
}
export default MarkDown;
