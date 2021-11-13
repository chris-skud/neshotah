import os
# import json 
import requests

def get_weather_by_zip(zipcode):
  key = os.getenv("OPEN_WEATHERMAP_KEY")

  get_weather_url = "https://api.openweathermap.org/data/2.5/weather?zip="+zipcode+"&units=Imperial&appid="+key
  resp = requests.get(url = get_weather_url)
  data = resp.json()

  # location = get_location(latitude, longitude)
  current_weather = {
    'temperature': round(data['main']['temp']),
    'feels_like': round(data['main']['feels_like']),
    'humidity': round(data['main']['humidity']),
    'sky': data['weather'][0]['main'],
    'description': data['weather'][0]['description']
  }
  return {'current_weather': current_weather}

def get_air_quality_by_zip(zipcode):
  latlng = get_latlong(zipcode) 
  return get_air_quality(str(latlng['lat']), str(latlng['lng']))

def get_air_quality(latitude, longitude):
    aqicn_token = os.getenv("AQICN_TOKEN")
    url = "https://api.waqi.info/feed/geo:"+latitude+";"+longitude+"/?token="+aqicn_token

    response = requests.get(url = url)
    data = response.json()

    aqi = data['data']['aqi']

    iaqi = {}
    iaqi_items = data['data']['iaqi'].items()
    for k, v in iaqi_items:
      iaqi[k] = v['v']

    location = get_location(latitude, longitude)

    return {'aqi': aqi, 'iaqi': iaqi, 'location': location}


def get_location(latitude, longitude):
  mapquest_key = os.getenv("MAPQUEST_KEY")
  url = "https://www.mapquestapi.com/geocoding/v1/reverse?key="+mapquest_key+"&location="+latitude+","+longitude+"&includeRoadMetadata=true&includeNearestIntersection=true"

  response = requests.get(url = url)
  data = response.json()

  return data['results'][0]['locations'][0]

def get_latlong(zipcode):
  mapquest_key = os.getenv("MAPQUEST_KEY")
  url = "https://www.mapquestapi.com/geocoding/v1/address?key="+mapquest_key+"&location="+zipcode

  response = requests.get(url = url)
  data = response.json()

  return data['results'][0]['locations'][0]['latLng']
