import json
from flask import Flask
from flask_restful import Resource, Api
from sources import get_weather

app = Flask(__name__, static_folder='static', static_url_path='')
api = Api(app)

#
# static file routes
#
@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js')
def js():
    return app.send_static_file('index.js')


#
# api routes
#
class GetData(Resource):
    def get(self):
        return get_weather()

api.add_resource(GetData, '/api/data')

app.run('0.0.0.0',8080)