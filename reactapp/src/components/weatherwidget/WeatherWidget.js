import { Form, Input, message } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import './weatherwidget.css';
var WeatherAPI = process.env.REACT_APP_WEATHER_API_SECRET;

function WeatherWidget(props) {
    var [showForm, setShowForm] = useState(false);
    const forecastsRef = useRef(null);
    const inputRef = useRef(null);
    const [formWeatherCity] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect( () => {
        const WeatherAPILoading = async () => {
            var response = await fetch('/weatherwidget/getcity', {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${props.token}`
            })

            var data = await response.json();
            if(data.city){
                const dataCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=${WeatherAPI}&lang=en&units=metric`)
                const dataForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&appid=${WeatherAPI}&lang=en&units=metric`)
                const bodyCurrent = await dataCurrent.json()
                const bodyForecast = await dataForecast.json()
                var temp = Math.round(bodyCurrent.main.temp)
                var icon = bodyCurrent.weather[0].icon

                props.setCurrentTemp(temp)
                props.setCurrentIcon(icon)
                props.setCurrentStatus(bodyCurrent.weather[0].description)
                props.setForecastList(bodyForecast.list)
                props.setCurrentCity(bodyCurrent.name)
            }
        }
        WeatherAPILoading()

        const handleResize = () => {
            if (forecastsRef.current) {
                forecastsRef.current.scrollTo({ left: 0, behavior: 'smooth' });// Reset scroll position on resize
            }
        };
        window.addEventListener('resize', handleResize);// Attach resize event listener
        return () => {// Cleanup listener on component unmount
            window.removeEventListener('resize', handleResize);
        };
      },[])

    useEffect(() => {
        if (showForm && inputRef.current) {
          inputRef.current.focus();
        }
    }, [showForm]);

    const popUp = (type, message) => {
        messageApi.open({
          type: type,
          content: message,
        });
      };

    const addCityWeather = async (values) => {
        formWeatherCity.resetFields();
        if(values.addWeatherCity !== undefined) {
            forecastsRef.current.scrollBy({ left: -2800});
            
            const dataCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${values.addWeatherCity}&appid=${WeatherAPI}&lang=en&units=metric`)
            const bodyCurrent = await dataCurrent.json()
            var name = values.addWeatherCity
                var nameFormated = name[0].toUpperCase() + name.slice(1);
            if(bodyCurrent.cod === "400" || bodyCurrent.cod === "404" ){
                popUp('error', `City name ${nameFormated} not found, try again`);
            
            } else if (bodyCurrent.cod === 200) {
                popUp('success', `${nameFormated} added to forecast`);
                const dataForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${values.addWeatherCity}&appid=${WeatherAPI}&lang=en&units=metric`)
                const bodyForecast = await dataForecast.json()
                setShowForm(false)

                var temp = Math.round(bodyCurrent.main.temp)
                var icon = bodyCurrent.weather[0].icon

                props.setCurrentTemp(temp)
                props.setCurrentIcon(icon)
                props.setCurrentStatus(bodyCurrent.weather[0].description)
                props.setForecastList(bodyForecast.list)
                props.setCurrentCity(bodyCurrent.name)

                var response = await fetch('/weatherwidget/addcity', {
                    method: 'POST',
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    body: `token=${props.token}&currentCity=${bodyCurrent.name}`
                })
                var data = await response.json();
                if(data.result){
                } else {
                    popUp('error', `Error. Check your internet connection`);
                }
            }
        }
    };

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        var hoursFormated = newDate.getHours() + ':00'
        return hoursFormated;   
    }

    const handleScrollLeft = () => {
        const forecastItemWidth = forecastsRef.current.querySelector('.ww-forecast-item').getBoundingClientRect().width;
        if (forecastsRef.current) {
            forecastsRef.current.scrollBy({ left: -forecastItemWidth, behavior: 'smooth' });
        }
    };
    const handleScrollRight = () => {
        const forecastItemWidth = forecastsRef.current.querySelector('.ww-forecast-item').getBoundingClientRect().width;
        if (forecastsRef.current) {
            forecastsRef.current.scrollBy({ left: forecastItemWidth, behavior: 'smooth' });
        }
    };

    if (props.forecastList.length !== 0 ) {
        var itemsForecast = props.forecastList[0].map((item, i) => {
            var dateformated = convertUTCDateToLocalDate(new Date(item.dt_txt));
            var degree = Math.round(item.main.temp)
            var icon = convertIconWeather(item.weather[0].icon)
            return (
                <div key={i} className='ww-forecast-item'>
                    <div className='ww-forecast-item-timeOrdate'>{dateformated}</div>
                    <img alt='icon' className='ww-forecast-item-picto' src={`images/weatherwidget/weather/${icon}.svg`}/>
                    <div className='ww-forecast-item-degrees'>{degree}°C</div>
                  </div>
            )
        })
    }

    var iconFormated = convertIconWeather(props.currentIcon)
    var wwBackground = setBackgroundOnCurrent(props.currentIcon)
    

    return (
        <div className={`weatherWidget ww-background-${wwBackground}`}>
            {contextHolder}
            <div className="ww-name-form">
                {
                    props.currentCity !== null && showForm === false
                        ? <div className='ww-name'>{props.currentCity}</div>
                        : undefined
                }
                {
                    showForm
                        ? <Form
                            name="basic"
                            className="ww-name-form ww-name-form-opacity"
                            form={formWeatherCity}
                            onFinish={addCityWeather}
                            autoComplete="off"
                            onBlur={() => setShowForm(false)}
                          >
                            <Form.Item name="addWeatherCity" className="ww-name-form-opacity">
                                <Input ref={inputRef} className="ww-name-form-input ww-name-form-opacity" allowClear/>
                            </Form.Item>
                        </Form>
                        : <button onClick={() => setShowForm(true)} className="ww-name-form-button">
                            <img alt='icon' className='ww-name-change-icon' src={'images/weatherwidget/icons/add.svg'}/>
                        </button>
                }
            </div>
            
            <div className='ww-current'>
              <div className="ww-current-degrees">{props.currentTemp}°C</div>
              <div className="ww-current-picto" >
                <img alt='icon' src={`images/weatherwidget/weather/${iconFormated}.svg`} />
                </div>
              <div className="ww-current-status" >{props.currentStatus}</div>
            </div>
            <div className='ww-spacer'></div>
            <div className='ww-forecast-container'>
                <button onClick={handleScrollLeft} className='ww-forecast-button'>
                    <img alt='icon' className='ww-forecast-icon' src={'images/weatherwidget/icons/left-circle.svg'}/>
                </button>
                <div className="ww-forecasts" ref={forecastsRef}>
                    {itemsForecast}
                </div>
                <button onClick={handleScrollRight} className='ww-forecast-button'>
                    <img alt='icon' className='ww-forecast-icon' src={'images/weatherwidget/icons/right-circle.svg'}/>
                </button>
            </div>
        </div>
    )
}

function mapStateToProps(state) { 
    return {
        currentCity: state.weatherCurrent.currentCity,
        currentTemp: state.weatherCurrent.currentTemp,
        currentStatus: state.weatherCurrent.currentStatus,
        currentIcon: state.weatherCurrent.currentIcon,
        forecastList: state.weatherForecast.items,
        token: state.userToken
    }
  }
  
function mapDispatchToProps(dispatch){
    return {
        setCurrentCity: function(city){
            dispatch({type: 'SET_CURRENT_CITY', payload: city})
        },
        setCurrentTemp: function(degrees){
            dispatch({type: 'SET_CURRENT_TEMP', payload: degrees})
        },
        setCurrentStatus: function(status){
            dispatch({type: 'SET_CURRENT_STATUS', payload: status})
        },
        setCurrentIcon: function(icon){
            dispatch({type: 'SET_CURRENT_ICON', payload: icon})
        },
        setForecastList: function(forecast){
            dispatch({type: 'SET_FORECAST', payload: forecast})
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WeatherWidget)

function convertIconWeather(icon) {
    switch(icon){
        case '01d': return('clear-day');
            break;
        case '01n': return('clear-night');
            break;
        case '02d': return('partly-cloudy-day');
            break;
        case '02n': return('partly-cloudy-night');
            break;
        case '03d': return('cloudy');
            break;
        case '03n': return('cloudy');
            break;
        case '04d': return('overcast');
            break;
        case '04n': return('overcast');
            break;
        case '09d': return('extreme-rain');
            break;
        case '09n': return('extreme-rain');
            break;
        case '10d': return('overcast-day-rain');
            break;
        case '10n': return('overcast-night-rain');
            break;
        case '11d': return('thunderstorms-day');
            break;
        case '11n': return('thunderstorms-night');
            break;
        case '13d': return('partly-cloudy-day-snow');
            break;
        case '13n': return('partly-cloudy-night-snow');
            break;
        case '50d': return('partly-cloudy-day-fog');
            break;
        case '50n': return('partly-cloudy-night-fog');
            break;
        default: return ('clear-day')

    }
}

function setBackgroundOnCurrent(icon) {
    switch(icon){
        case '01d': case '02d': case '03d': case '13d': case '50d':
            return('clearday');
            break;
        case '04d': case '04n': case '09d': case '19n': case '10d': case '10n': case '11d': case '11n':
            return('rainycloudy');
            break;
        case '01n': case '02n': case '03n': case '13n': case '50n':
            return('clearnight');
            break;
        default: return('clearday');
    }
}