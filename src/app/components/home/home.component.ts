import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UNIT } from 'src/app/constants/weather-const';
import { UserCoordinates } from 'src/app/Interfaces/general/coordinates';
import { WeatherRes } from 'src/app/Interfaces/response/weather-response';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private cancelationSubscription = new Subscription()
  public isLoading = false
  public error = false
  public weatherConditionData: WeatherRes = {}
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.initValuesOnLoad()
    this.getUserCurrentLocation()
  }

  getUserCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        this.getCurrentWeatherCondition({ latitude, longitude })
      }, (error) => {
        this.error = true
        this.isLoading = false
      })
    } else {
      this.isLoading = false
      this.error = true
    }
  }

  getCurrentWeatherCondition(coordinates: UserCoordinates) {
    const params = {
      lat: coordinates.latitude,
      lon: coordinates.longitude,
      units: UNIT
    }

    this.cancelationSubscription.add(
      this.weatherService.getUserCurrentWeather(params).subscribe((data: WeatherRes) => {
        this.weatherConditionData = data
        this.isLoading = false
      }, (error) => {
        this.error = true
        this.isLoading = false
      })
    )
  }

  initValuesOnLoad() {
    this.isLoading = true
    this.error = false
    this.weatherConditionData = {}
  }

  refresh() {
    this.initValuesOnLoad()
    this.getUserCurrentLocation()
  }

  ngOnDestroy() {
    this.cancelationSubscription.unsubscribe()
  }
}
