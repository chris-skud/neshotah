from flask import Flask, request
from flask_restful import Resource, Api
from sources import get_weather_by_zip, get_air_quality, get_air_quality_by_zip

app = Flask(__name__, static_folder='static', static_url_path='')
api = Api(app)

app.url_map.strict_slashes = False

#
# static file routes
#
@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js')
def js():
    return app.send_static_file('index.js')

@app.route('/css')
def css():
    return app.send_static_file('app-style.css')


#
# api routes
#
class GetWeather(Resource):
    def get(self):
        # latitude = request.args.get('latitude')
        # longitude = request.args.get('longitude')
        zipcode = request.args.get('zipcode')
        # if zipcode == None:
        #   return get_weather(latitude, longitude)
        # else:
        return get_weather_by_zip(zipcode)
        

api.add_resource(GetWeather, '/api/weather/', methods=['GET'], strict_slashes=False)

class GetAirQuality(Resource):
    def get(self):
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        zipcode = request.args.get('zipcode')
        if zipcode == None:
          return get_air_quality(latitude, longitude)
        else:
          return get_air_quality_by_zip(zipcode)

api.add_resource(GetAirQuality, '/api/quality/', methods=['GET'], strict_slashes=False)
