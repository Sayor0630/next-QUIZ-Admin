// ReactQuillComponent.js
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReactQuillComponent = ({ value }) => {
  return <ReactQuill value={value} readOnly theme="snow" />;
};

export default ReactQuillComponent;
