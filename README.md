# neshotah

Hacking air quality data

## dev
### Set environemnt vars (keys stored in pw database)

`export OPEN_WEATHERMAP_KEY=shhh; export AQICN_TOKEN=shh; export MAPQUEST_KEY=shh`

### Run `ngrok` to avoid any weird localhost restrictions

`ngrok http 8000`

### Run the flask dev server

`flask --app main.py run --port 800`

### Hit the ngrok server endpoint

(e.g. `https://3e2c-174-29-126-119.ngrok-free.app/`)