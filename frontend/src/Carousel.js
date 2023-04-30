import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState, useEffect } from 'react';
import gif from './Icons/book-turning-animation.gif'

export default function Carousel({data, setData, handleScreenChange}) {
    const [sliderData, setSliderData] = useState([]);
    const [researchData, setResearchData] = useState({});
    const [performingResearch, setPerformingResearch] = useState(true);
    const [alreadyRun, setAlreadyRun] = useState(false);

    useEffect(() => {
        // Extract the data from props and transform it into an array of objects
        const proc_data = Object.entries(data).map(([key, value]) => ({
        key,
        value,
        }));
        setSliderData(proc_data);
    }, [data]);

    const performResearch = async () => {
        try {
        const response = await fetch('http://127.0.0.1:8080/research', {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: JSON.stringify(data),
        });
        const resp_data = await response.json();
        console.log(resp_data);
        setResearchData(resp_data);
        setPerformingResearch(false);
        } catch (error) {
            console.log(JSON.stringify(data));
            console.error(error);
        }
    };

    useEffect(() => {
        if(alreadyRun == false){
            performResearch();
            setAlreadyRun(true);
        }
    }, []);
    
    console.log("running carousel");

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return(
        <div>
        <Slider {...settings}>
            {sliderData.map((item, index) => (
                <div>
                <h3>{item.key}</h3>
                <p>{item.value}</p>
                </div>
            ))}
        </Slider>
        {
            performingResearch ?
            <div className="gif_container">
                <img className="gif" src={gif} alt="gif" />
                <p className="gif_text">Performing additional case research...</p>
            </div>
            :
            <div>
                <h>Inconsistencies</h>
                <p>{researchData.inconsistencies}</p>
                <h>Suggested additional documents</h>
                <p>{researchData.addl_docs}</p>
                <h>similar_cases</h>
                <p>source: {researchData.similar_cases[0]}</p>
                <p>{researchData.similar_cases[1]}</p>
            </div>
        }
        
        </div>
    )
}


