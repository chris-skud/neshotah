import json

def get_weather():
  return json.loads('["foo", {"bar":["baz", null, 1.0, 2]}]')