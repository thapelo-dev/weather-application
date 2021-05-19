import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoading = false
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getUserCurrentLocation()
  }

  getUserCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        this.getCurrentWeatherCondition({ latitude, longitude })
      })
    }
  }

  getCurrentWeatherCondition(coordinates: any) {
    const params = {
      lat: coordinates.latitude,
      lon: coordinates.longitude,
      units: 'metric'
    }

    this.weatherService.getUserCurrentWeather(params).subscribe(data => {
      console.log(data)
    }, (error) => {
      console.log(error)
    })
  }

}
