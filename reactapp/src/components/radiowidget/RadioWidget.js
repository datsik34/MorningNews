import React, { useRef, useState, useEffect }  from 'react';
import './radiowidget.css';

export default function RadioPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showSlider, setShowSlider] = useState(false);
  
    const streamUrl1 = 'http://deeperlink.com:8020/deep';
    const streamUrl2 = 'http://kathy.torontocast.com:1800/stream';
    const streamUrl3 = 'http://kathy.torontocast.com:1690/stream';
    const stream = streamUrl1;
  
    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };
  
    const handleVolumeChange = (event) => {
      const newVolume = event.target.value;
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };
  
    useEffect(() => {
      audioRef.current.src = stream;
      audioRef.current.volume = volume;
    }, []);
  
    return (
      <div className='container'>
        <div className='group'>
            <img className='cover' src='images/radiowidget/radio1.jpg'/>
            <p className='radio-name'>Old Deep House Radio</p>
        </div>
        <div className='group'>
            <button 
                className='button volume-container'
                onMouseEnter={() => setShowSlider(true)}
                onMouseLeave={() => setShowSlider(false)}
            >
                <img src='images/radiowidget/volume-high.svg' className='icon-volume'/>
                {
                    showSlider && (
                        <div className='div-volume-slider'>
                            <input
                                type="range"
                                id="volumeControl"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                    )
                }
            </button>
            <button className='button' onClick={() => togglePlay()}>
                {
                    isPlaying 
                    ? <img src='images/radiowidget/pause.svg' className='icon-play-pause' /> 
                    :<img src='images/radiowidget/play.svg' className='icon-play-pause' /> 
                }
            </button>
            <button className='button' ><img src='images/radiowidget/playlist.svg' className='icon-playlist'/></button>
        </div>
        <audio ref={audioRef} controls style={{ display: 'none' }} />
      </div>
    );
}