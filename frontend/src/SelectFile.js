import './SelectFile.css'
import file from './Icons/file.png'
import upload from './Icons/upload.png'
import close from './Icons/close.png'
import { useState } from 'react';
/*
export default function SelectFile() {
  const [setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);

  };

  return (
    <div className="forHighlight">
        <div className="select_file_container">
      <label display='none' htmlFor="file_input">
        <div className="top_select">
          <div className="close_container">
            <img className='close' src={close} alt='close' />
          </div>
          <img className='file' src={file} alt='document' />
        </div>
        <div className="bottom_select">
          <img className='upload' src={upload} alt='upload' />
          <p>Select Your File</p>
        </div>
      </label>
      <input
        id="file_input"
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
    </div>
  );
}

*/


/*
export default function SelectFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [show, setShow] = useState(true);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCloseClick = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="forHighlight">
      <div className="select_file_container">
        <div className="top_select">
          <div className="close_container" onClick={handleCloseClick}>
            <img className="close" src={close} alt="close" />
          </div>
          <img className="file" src={file} alt="document" />
        </div>
        <div className="bottom_select">
          <img className="upload" src={upload} alt="upload" />
          <p>Select Your File</p>
        </div>
        <label display="none" htmlFor="file_input">
          <input
            id="file_input"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
}
*/

export default function SelectFile(props) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleCloseClick = (index) => {
    setSelectedFile(null);
    props.deleteFile(index);
  };

  if(!props.display){
    return null;
  }

  return (
    <>
        <label className="forHighlight" htmlFor="file_input">
          <div className="select_file_container">
            <div className="top_select">
              <div className="close_container" onClick={() => handleCloseClick(props.index)}>
                <img className="close" src={close} alt="close" />
              </div>
              <img className="file" src={file} alt="document" />
            </div>
            <div className="bottom_select">
              <div className="uploadContainer">
                <img className="upload" src={upload} alt="upload" />
                <p>Select Your File</p>
              </div>
              <p>{selectedFile && selectedFile.name}</p>
            </div>
          </div>
        </label>
    
      <input
        id="file_input"
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
}

