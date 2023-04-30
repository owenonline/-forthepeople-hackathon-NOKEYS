import { useState, useEffect } from 'react';
import './UploadContainer.css';
import gif from './Icons/book-turning-animation.gif'
import './Processing.css'
import Carousel from './Carousel';

export default function Processing({files, setFiles, data, setData, handleScreenChange}) {
    const [alreadyRun, setAlreadyRun] = useState(false);

    const formData = new FormData();
    if (files) {
        console.log('yoyo');
    } else {
        console.log('nope');
    }
    files.forEach((file) => {
        formData.append(file.file.name, file.file);
        console.log(file.file.name);
    });

    console.log("running processing");

    const uploadFiles = async () => {
        try {
        const response = await fetch('http://127.0.0.1:8080/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        console.log(data);
        setData(data);
        handleScreenChange();
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        if(alreadyRun == false){
            uploadFiles();
            setAlreadyRun(true);
        }
    }, []);
    
    return (
        <div className="gif_container">
        <img className="gif" src={gif} alt="gif" />
        <p className="gif_text">Generating Summaries...</p>
        </div>
    );
}