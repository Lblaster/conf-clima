import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from './app_component/weather.component';
import Form from './app_component/form.component';
import thunder from './lotties/4805-weather-thunder.json';
import chuvisco from './lotties/4801-weather-partly-shower.json';
import chuvaforte from './lotties/4803-weather-storm.json';
import neve from './lotties/4793-weather-snow.json';
import neblina from './lotties/4795-weather-mist.json';
import limpo from './lotties/4804-weather-sunny.json';
import nuvem from './lotties/4800-weather-partly-cloudy.json';


const API_key = "8fcfd9937e2b227fff0f46b55e666bf4"

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: null,
      temp_min: null,
      description:"",
      error:false
    };

    this.weatherIcon={
      Thunderstorm: thunder,
      Drizzle: chuvisco,
      Rain: chuvaforte,
      Snow: neve,
      Mist: neblina,
      Clear: limpo,
      Clouds: nuvem

    };
  }

  getWeather = async e =>{
    e.preventDefault();

    const country = e.target.elements.country.value;
    const city = e.target.elements.city.value;

    if(city&&country){
      const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=${API_key}`);

      const response = await api_call.json();
  
      this.setState({
        city: `${response.name}, ${response.sys.country}`,
        celsius: this.calCelsius(response.main.temp),
        temp_max: this.calCelsius(response.main.temp_max),
        temp_min: this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      });
  
      this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
      console.log(response);
    }else{
      this.setState({error: true});
    }
  };

  calCelsius(temp){
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeatherIcon(icons, rangeId){
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        this.setState({icon:this.weatherIcon.Thunderstorm});
        break;
      case rangeId >= 300 && rangeId <= 321:
          this.setState({icon:this.weatherIcon.Drizzle});
      break;
      case rangeId >= 500 && rangeId <= 531:
          this.setState({icon:this.weatherIcon.Rain});
      break;
      case rangeId >= 600 && rangeId <= 622:
          this.setState({icon:this.weatherIcon.Snow});
      break;
      case rangeId >= 701 && rangeId <= 781:
          this.setState({icon:this.weatherIcon.Mist});
      break;
      case rangeId === 800:
          this.setState({icon:this.weatherIcon.Clear});
      break;
      case rangeId >= 801 && rangeId <= 804:
          this.setState({icon:this.weatherIcon.Clouds});
      break;
      default:
        this.setState({icon:this.weatherIcon.Clouds});
    }
  }

  render(){
    return(
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        cityname={this.state.city} 
        temp_celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        description={this.state.description}
        weatherIcon={this.state.icon}
        />
      </div>
    );
  }
}


export default App;
