import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.initValuesOnLoad()
    this.getUserCurrentLocation()
  }

  getUserCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        this.getCurrentWeatherCondition({ latitude, longitude })
      }, error => {
        this.error = true;
        this.isLoading = false;
      })
    } else {
      this.isLoading = false;
      this.error = true;
    }
  }

  getCurrentWeatherCondition(coordinates: any) {
    const params = {
      lat: coordinates.latitude,
      lon: coordinates.longitude,
      units: 'metric'
    }

    this.cancelationSubscription.add(
      this.weatherService.getUserCurrentWeather(params).subscribe(data => {
        this.isLoading = false
        console.log(data)
      }, (error) => {
        console.log(error)
        this.error = true
      })
    )
  }

  initValuesOnLoad() {
    this.isLoading = true
    this.error = false
  }

  refresh() {
    this.initValuesOnLoad()
    this.getUserCurrentLocation()
  }

  ngOnDestroy() {
    this.cancelationSubscription.unsubscribe()
  }
}
