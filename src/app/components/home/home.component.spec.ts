import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WeatherService } from 'src/app/services/weather.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        HttpClient,
        HttpHandler,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component ngOnit', () => {
    it('Should call two functions', () => {

      spyOn(component, 'initValuesOnLoad').and.callThrough();
      spyOn(component, 'getUserCurrentLocation').and.callThrough();

      component.ngOnInit();

      expect(component.initValuesOnLoad).toHaveBeenCalled();
      expect(component.getUserCurrentLocation).toHaveBeenCalled();
    })
  })

  describe('Component getUserCurrentLocation', () => {
    it('Should get user location and call getCurrentWeatherCondition', () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
        const position = {
          coords: {
            latitude: -21.87,
            longitude: 29.10
          }
        };
        arguments[0](position);
      });
      spyOn(component, 'getCurrentWeatherCondition').and.callThrough();
      const expectedParams = {
        latitude: -21.87,
        longitude: 29.10
      }

      component.getUserCurrentLocation();

      expect(component.getCurrentWeatherCondition).toHaveBeenCalledWith(expectedParams);
    })

    it('Should set error to true when location fails', () => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
        const error = {
          error: 'something happened'
        };
        arguments[1](error);
      });

      component.getUserCurrentLocation();

      expect(component.error).toBeTrue();
      expect(component.isLoading).toBeFalse();
    })

  })

  describe('Component getCurrentWeatherCondition', () => {
    it('Should get current weather conditions', inject([WeatherService], (injectWeatherService: WeatherService) => {
      const returnValue = {
        name: 'Centurion'
      }
      spyOn(injectWeatherService, 'getUserCurrentWeather').and.returnValue(of(returnValue));
      const coordinates = {
        latitude: -21.87,
        longitude: 29.10
      }

      component.getCurrentWeatherCondition(coordinates);

      expect(component.isLoading).toBeFalse();
    }))

    it('Should set error to true on error', inject([WeatherService], (injectWeatherService: WeatherService) => {
      spyOn(injectWeatherService, 'getUserCurrentWeather').and.throwError('something went wrong').and.callThrough();
      const coordinates = {
        latitude: -21.87,
        longitude: 29.10
      }

      component.getCurrentWeatherCondition(coordinates);

      expect(component.error).toBeTrue();
      expect(component.isLoading).toBeFalse();
    }))
  })


  describe('Component initValuesOnLoad', () => {
    it('Should initialise values', () => {
      component.initValuesOnLoad();

      expect(component.isLoading).toBeTrue();
      expect(component.error).toBeFalse();
      expect(component.weatherConditionData).toEqual({});
    })
  })

  describe('Component refresh', () => {
    it('Should call to functions', () => {
      spyOn(component, 'initValuesOnLoad').and.callThrough();
      spyOn(component, 'getUserCurrentLocation').and.callThrough();

      component.refresh();

      expect(component.initValuesOnLoad).toHaveBeenCalled();
      expect(component.getUserCurrentLocation).toHaveBeenCalled();
    })
  })
});
