/*import './AddFile.css'
import plus from './Icons/plus.png'
import { useState } from 'react';
import SelectFile from './SelectFile';
import plus2 from './Icons/plus2.png'

export default function AddFile() {
    const [files, setFiles] = useState([]);

    const handleClick = () => {
        setFiles([...files, <SelectFile />]);
        
    };
    return (
        <>
        {files}
        <div className="add_file_container" onClick={handleClick}>
            <div className="top">
                <img className='add' src={plus} alt='plus'></img>
            </div>
            <div className="bottom">
                <img className='upload' src={plus2} alt='plus'></img>
                <p>Add File</p>
            </div>
        </div>
        </>
        
    );
}
*/

import './AddFile.css';
import plus from './Icons/plus.png';
import { useState } from 'react';
import SelectFile from './SelectFile';
import plus2 from './Icons/plus2.png';

export default function AddFile(props) {

  const handleClick = () => {
    props.setFiles([...props.files, <SelectFile deleteFile={props.deleteFile} files={props.files} setFiles={props.setFiles} display={false} />]);
  };

  const removeFile = (indexToRemove) => {
    props.setFiles(props.files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      {props.files.map((file, index) => (
        <SelectFile index={index} display={true} />
        ))}
      <div className="add_file_container" onClick={handleClick}>
        <div className="top">
          <img className='add' src={plus} alt='plus' />
        </div>
        <div className="bottom">
          <img className='upload' src={plus2} alt='plus' />
          <p>Add File</p>
        </div>
      </div>
    </>
  );
}

