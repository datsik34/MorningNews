import React, { useRef, useState, useEffect }  from 'react';
import './radiowidget.css';

const radioPlaylist = [
  {
    name: 'Old Deep House Radio',
    url: 'http://deeperlink.com:8020/deep',
    img: 'images/radiowidget/radio1.jpg'
  },
  {
    name: 'VIBELYFE Soulful House',
    url: 'http://kathy.torontocast.com:1800/stream',
    img: 'images/radiowidget/radio2.jpg'
  },
  {
    name: 'VL100 Classic Hits Collection',
    url: 'http://kathy.torontocast.com:1690/stream',
    img: 'images/radiowidget/radio3.jpg'
  }
]

export default function RadioPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState(null);
    const [showSlider, setShowSlider] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [radioPlaying, setRadioPlaying] = useState(radioPlaylist[0])

    useEffect(() => {
      audioRef.current.src = radioPlaying.url;
      audioRef.current.volume = volume;

      if(isPlaying){
        var playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
          }).then(_ => {
          }).catch(error => {
          });
        }
      } else {
        togglePlay();
      }
    }, [radioPlaying]);
  
    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        var playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
          }).catch(error => {
          });
        }
      }
      setIsPlaying(!isPlaying);
    };
    
  
    const handleVolumeChange = (event, mute) => {
      var newVolume;
      if(mute){
        if(volume == 0){
          if(previousVolume === null){
            newVolume = 1;
          } else {
            newVolume = previousVolume
            setPreviousVolume(null)
          }
        } else {
          setPreviousVolume(volume)
          newVolume = 0
        }
      }else{
        newVolume = event.target.value;
      }
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };

     var volumeIcon;
     if(volume == 0){
      volumeIcon = 'volume-muted';
     } else if(volume <= 0.5) {
      volumeIcon = 'volume-low';
     } else {
      volumeIcon = 'volume-high';
     }
     
    var wrappedPlaylist = radioPlaylist.map((radio, i) => {
      return(
        <div key={i} className='group pointer-effect' onClick={() => setRadioPlaying(radio)}>
          <div className='cover-container'>
            <img className='cover' src={radio.img}/>
            {radioPlaying.name === radio.name && (
              <img src={`${process.env.PUBLIC_URL}/images/radiowidget/play-animation.gif`} alt="Playing..." className="playing-gif" />
            )}
          </div>
          <p className='radio-name'>{radio.name}</p>
        </div>
      )
    })

    return (
      <div className={`container ${showPlaylist ? 'container-playlist' : ''}`}>
        <div className='group'>
            <img className='cover' src={radioPlaying.img}/>
            <p className='radio-name'>{radioPlaying.name}</p>
        </div>
        <div className='group'>
            <button 
                className='button volume-container'
                onMouseEnter={() => setShowSlider(true)}
                onMouseLeave={() => setShowSlider(false)}
                onClick={() => handleVolumeChange(null, true)} 
            >
                <img src={`images/radiowidget/${volumeIcon}.svg`} className='icon-volume'/>
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
                                className='input'
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
            <button className='button' onClick={() => setShowPlaylist(!showPlaylist)} ><img src='images/radiowidget/playlist.svg' className='icon-playlist'/></button>
        </div>
        {wrappedPlaylist}
        <audio ref={audioRef} controls/>
      </div>
    );
}