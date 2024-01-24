import React, { useState, useRef } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.jpg'

// const OPENAI_API_KEY = process.env.REACT_APP_API_KEY;

const ImageGenerator = () => {

    const [image, setImage] = useState("/");

    const [loading, setLoading] = useState(false);

    const [prefixes, setPrefixes] = useState([]);

    const [selectedButton, setSelectedButton] = useState(null);

    let inputRef = useRef(null);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return 0;
        }
        setLoading(true);
        const combinedPrefix = prefixes.join(" ");
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,

                },
                body: JSON.stringify({
                    prompt: `${combinedPrefix} ${inputRef.current.value}`,
                    n: 1,
                    size: "1024x1024",
                    response_format: "b64_json"
                }),
            }
        );
        let data = await response.json();
        let data_array = data.data;
        setImage(`data:image/jpeg;base64,${data_array[0].b64_json}`);
        setLoading(false);
    };

    const handleDownload = () => {
        console.log(image);
        if (image !== "/") {
            const link = document.createElement("a");
            link.href = image;
            link.download = "generated_image.png";
            link.click();
        }
    };

    const handleButtonClick = (prefix) => {
        setPrefixes([prefix]);
        setSelectedButton(prefix);
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image Generator</div>
            <div className="search-box">
                <input type="text" ref={inputRef} className='search-input' placeholder='Describe What You Want To Create' />
                <div className="generate-btn" onClick={imageGenerator}>
                    Generate
                </div>

            </div>
            <div className='filter-btn'>
                <button
                    className={selectedButton === 'Standard' ? 'selected' : ''}
                    onClick={() => handleButtonClick('Standard')}
                >
                    Standard
                </button>

                <button
                    className={selectedButton === 'Digital Art' ? 'selected' : ''}
                    onClick={() => handleButtonClick('Digital Art')}
                >
                    Digital Art
                </button>

                <button
                    className={selectedButton === 'Anime Portrait' ? 'selected' : ''}
                    onClick={() => handleButtonClick('Anime Portrait')}
                >
                    Anime Portrait
                </button>

                <button
                    className={selectedButton === 'Abstract Painting' ? 'selected' : ''}
                    onClick={() => handleButtonClick('Abstract Painting')}
                >
                    Abstract Painting
                </button>
            </div>

            <div className="img-loading">
                <div className="image"><img src={image === "/" ? default_image : image} alt="" /></div>
                <div className="loading">
                    <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
                    <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                </div>
            </div>
            <button onClick={handleDownload} className='download-btn'>
                Download
            </button>

        </div>
    )
}

export default ImageGenerator
