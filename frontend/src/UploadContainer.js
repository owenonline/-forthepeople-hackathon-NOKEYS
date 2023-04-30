/*
import "./UploadContainer.css";
import { useState } from "react";
import plus from "./Icons/plus.png";
import plus2 from "./Icons/plus2.png";
import document from "./Icons/file.png";
import upload from "./Icons/upload.png";
import close from "./Icons/close.png";
import './SelectFile.css'
import './AddFile.css'
import Processing from './Processing'

export default function UploadContainer(props) {
  const handleClick = () => { 
    props.setFiles(props.files);
    props.handleScreenChange();
    // props.onTransition(<Processing files={files} onTransition={props.onTransition}/>);
  };

  // const [files, setFiles] = useState([]);

  function addFile() {
    props.setFiles([...props.files, { file: null, index: props.files.length }]);
  }

  function handleFileChange(e, index) {
    const newFiles = [...props.files];
    newFiles[index] = { ...newFiles[index], file: e.target.files[0] };
    props.setFiles(newFiles);
    console.log(props.files)
  }

  function deleteFile(index) {
    props.setFiles(props.files.filter((_, i) => i !== index));
  }

  return (
    <div className="parent">
      <div className="upload_case_files_container">
        <div className="title_container">
          <p className="title_text">Upload Case Files</p>
          <div className="analyze_button_container">
            <button className="analyze_button" onClick={handleClick}>Analyze Case</button>
          </div>
        </div>
        <div className="file_container">
          <div className="add_file_container" onClick={addFile}>
            <div className="top">
              <img className="add" src={plus} alt="plus" />
            </div>
            <div className="bottom">
              <img className="upload" src={plus2} alt="plus" />
              <p>Add File</p>
            </div>
          </div>
          {props.files.map((file, index) => (
            <div className="select_file_container_container" key={`file-${index}`}>
              <label
                className="forHighlight"
                htmlFor={`file_input-${index}`}
              >
                <div className="select_file_container">
                  <div className="top_select">
                    <div
                      className="close_container"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFile(index);
                      }}
                    >
                      <img className="close" src={close} alt="close" />
                    </div>
                    <img className="file" src={document} alt={file} />
                  </div>
                  <div className="bottom_select">
                    <div className="uploadContainer">
                      <img className="upload" src={upload} alt="upload" />
                      <p>Select Your File</p>
                    </div>
                  </div>
                </div>
              </label>

              <input
                id={`file_input-${index}`}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                onChange={(e) => handleFileChange(e, index)}
                style={{ display: "none" }}
                multiple
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
*/

import "./UploadContainer.css";
import { useState } from "react";
import plus from "./Icons/plus.png";
import plus2 from "./Icons/plus2.png";
import document from "./Icons/file.png";
import upload from "./Icons/upload.png";
import close from "./Icons/close.png";
import './SelectFile.css'
import './AddFile.css'
import Processing from './Processing'

export default function UploadContainer(props) {
  const handleClick = () => { 
    props.setFiles(props.files);
    props.handleScreenChange();
    // props.onTransition(<Processing files={files} onTransition={props.onTransition}/>);
  };

  // const [files, setFiles] = useState([]);

  function addFile() {
    props.setFiles([...props.files, { file: null, index: props.files.length }]);
  }

  function handleFileChange(e, index) {
    const newFiles = [...props.files];
    newFiles[index] = { ...newFiles[index], file: e.target.files[0] };
    props.setFiles(newFiles);
    console.log(props.files)
  }

  function deleteFile(index) {
    props.setFiles(props.files.filter((_, i) => i !== index));
  }

  function formatFileName(fileName) {
    const fileNameLength = fileName.length;
    const maxLength = 12; // 8 + 4

    if (fileNameLength <= maxLength) {
      return fileName;
    } else {
      const firstPart = fileName.substring(0, 8);
      const lastPart = fileName.substring(fileNameLength - 4, fileNameLength);
      return `${firstPart}...${lastPart}`;
    }
  }

  return (
    <div className="parent">
      <div className="upload_case_files_container">
        <div className="title_container">
          <p className="title_text">Upload Case Files</p>
          <div className="analyze_button_container">
            <button className="analyze_button" onClick={handleClick}>Analyze Case</button>
          </div>
        </div>
        <div className="file_container">
          <div className="add_file_container" onClick={addFile}>
            <div className="top">
              <img className="add" src={plus} alt="plus" />
            </div>
            <div className="bottom">
              <img className="upload" src={plus2} alt="plus" />
              <p>Add File</p>
            </div>
          </div>
          {props.files.map((file, index) => (
            <div className="select_file_container_container" key={`file-${index}`}>
              <label
                className="forHighlight"
                htmlFor={`file_input-${index}`}
              >
                <div className="select_file_container">
                  <div className="top_select">
                    <div
                      className="close_container"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteFile(index);
                      }}
                    >
                      <img className="close" src={close} alt="close" />
                    </div>
                    <img className="file" src={document} alt={file} />
                  </div>
                  <div className="bottom_select">
                    <div className="uploadContainer">
                      <img className="upload" src={upload} alt="upload" />
                      <p>{file.file ? formatFileName(file.file.name) : "Select Your File"}</p>
                    </div>
                  </div>
                </div>
              </label>

              <input
                id={`file_input-${index}`}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
                onChange={(e) => handleFileChange(e, index)}
                style={{ display: "none" }}
                multiple
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
