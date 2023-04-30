import React, { useState } from "react";
import './App.css';
import Navbar from './Navbar';
import UploadContainer from './UploadContainer';
import Footer from './Footer';
import Processing from './Processing'
import Carousel from "./Carousel";
/*
function App() {
  const handleScreenChange = (nextComponent) => {
    setCurrentComponent(nextComponent);
  };
  const [CurrentComponent, setCurrentComponent] = useState(<UploadContainer onTransition={handleScreenChange}/>);

  return (
    <div className="App">
      <Navbar />
      <CurrentComponent/>
      <Footer />
    </div>
  );
}

export default App;
*/

function TempComponent(props){
  return(
    <div>
      {props.currentComponent == "UploadContainer" &&
        <UploadContainer files={props.files} setFiles={props.setFiles} handleScreenChange={props.handleScreenChange} />
      }
      {props.currentComponent == "Processing" &&
        <Processing files={props.files} setFiles={props.setFiles} data={props.data} setData={props.setData} handleScreenChange={props.handleScreenChange} />
      }
      {props.currentComponent == "Carousel" &&
        <Carousel data={props.data} setData={props.setData} handleScreenChange={props.handleScreenChange} />
      } 
    </div>
  )
}

function App() {
  const [currentComponent, setCurrentComponent] = useState("UploadContainer");
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({});

  const handleScreenChange = () => {
    if (currentComponent == "UploadContainer") {
      setCurrentComponent("Processing");
    } else if (currentComponent == "Processing") {
      setCurrentComponent("Carousel");
    }
    // setCurrentComponent(nextComponent);
  };

  // const [currentComponent, setCurrentComponent] = useState(() => (
  //   <UploadContainer onTransition={handleScreenChange} />
  // ));

  return (
    <div className="App">
      <Navbar />
      <TempComponent files={files} data={data} setFiles={setFiles} setData={setData} currentComponent={currentComponent} handleScreenChange={handleScreenChange}/>
      {/* {React.createElement(currentComponent, {
        files,
        data,
        setFiles,
        setData,
        handleScreenChange,
      })} */}
      {/* {currentComponent} */}
      <Footer />
    </div>
  );
}

export default App;
