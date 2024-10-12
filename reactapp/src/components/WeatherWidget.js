import { Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import '../App.css';
var WeatherAPI = process.env.REACT_APP_WEATHER_API_SECRET;

function WeatherWidget(props) {
    var [showForm, setShowForm] = useState(false);
    var [forecast, setForecast] = useState([]);

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        var hoursFormated = newDate.getHours() + ':00'
        return hoursFormated;   
    }

    function convertIconWeather(icon) {
        switch(icon){
            case '01d': return('clear-day');
                break;
            case '01n': return('clear-night');
                break;
        }
    }



    const [formWeatherCity] = Form.useForm();
    
    const addCityWeather = async (values) => {
        formWeatherCity.resetFields();
        if(values.addWeatherCity !== undefined) {
            const dataCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${values.addWeatherCity}&appid=${WeatherAPI}&lang=en&units=metric`)
            const bodyCurrent = await dataCurrent.json()
            if(bodyCurrent.cod === "400" || bodyCurrent.cod === "404" ){
                console.log('error not found or bad query');
                console.log(bodyCurrent);
            
            } else if (bodyCurrent.cod === 200) {
                const dataForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${values.addWeatherCity}&appid=${WeatherAPI}&lang=en&units=metric`)
                const bodyForecast = await dataForecast.json()
                setShowForm(false)
                props.addWeatherCity(bodyCurrent.name)

                var temp = Math.round(bodyCurrent.main.temp)
                props.addTemperature(temp)

                console.log(bodyCurrent);
                
                var icon = bodyCurrent.weather[0].icon
                props.addIcon(icon)
                props.addStatus(bodyCurrent.weather[0].description)
                setForecast(bodyForecast.list)
            }
        }
    };

    if (forecast.length !== 0 ) {
        var itemsForecast = forecast.map((item, i) => {
            var dateformated = convertUTCDateToLocalDate(new Date(item.dt_txt));
            var degree = Math.round(item.main.temp)
            var icon = item.weather[0].icon
            return (
                <div key={i} className='ww-forecast-item'>
                    <div className='ww-forecast-item-timeOrdate'>{dateformated}</div>
                    <img className='ww-forecast-item-picto' src={'icons/weather/overcast-sleet.svg'}/>
                    <div className='ww-forecast-item-degrees'>{degree}°C</div>
                  </div>
            )
        })
    }

    var iconFormated = convertIconWeather(props.currentIcon)
    console.log(iconFormated);
    
    
    

    return (
        <div className="weatherWidget">
            <div className="ww-name-form">
                {
                    props.weatherCity !== null && showForm === false
                        ? <div className='ww-name'>{props.weatherCity}</div>
                        : undefined
                }
                {
                    showForm
                        ? <Form name="basic" className="ww-name-form ww-name-form-opacity" form={formWeatherCity} onFinish={addCityWeather} autoComplete="off">
                            <Form.Item name="addWeatherCity" className="ww-name-form-opacity">
                                <Input className="ww-name-form-input ww-name-form-opacity" allowClear/>
                            </Form.Item>
                        </Form>
                        : <button onClick={() => setShowForm(true)} className="ww-name-form-button">
                            <img  className='ww-name-change-icon' src={'icons/add.svg'}/>
                        </button>
                }
            </div>
            
            <div className='ww-current'>
              <div className="ww-current-degrees">{props.currentDegrees}°C</div>
              <div className="ww-current-picto" >
                <img className='ww-current-picto' src={`icons/weather/${iconFormated}.svg`} />
                </div>
              <div className="ww-current-status" >
              {props.currentStatus}
              </div>
            </div>

            <div className='ww-spacer'></div>

            <div className='ww-forecast'>
                {itemsForecast}
            </div>
        </div>
    )
}

function mapStateToProps(state) { 
    return {
        weatherCity: state.weatherCity,
        currentDegrees: state.currentDegrees,
        currentStatus: state.currentStatus,
        currentIcon: state.currentIcon,

    }
  }
  
function mapDispatchToProps(dispatch){
    return {
        addWeatherCity: function(city){
            dispatch({type: 'addWeatherCity', cityAdded: city})
        },
        addTemperature: function(degrees){
            dispatch({type: 'addTemperature', tempAdded: degrees})
        },
        addStatus: function(status){
            dispatch({type: 'addStatus', statusAdded: status})
        },
        addIcon: function(icon){
            dispatch({type: 'addIcon', iconAdded: icon})
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WeatherWidget)