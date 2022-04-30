// prod
const wloc = window.location;
const baseURL = wloc.protocol + "//" + wloc.host + "/api/";

// local dev
// const baseURL = window.location + '/api/';

const app = Vue.createApp({
  data(){
    return {
      zip: null,
      current_weather: {temperature: ''},
      propaganda_hidden: true,
      weather_details_hidden: true,
      aqi: '',
      iaqi_hidden: true,
      iaqi: null,
      location: null,
      dogify_state: null,
      question: true
    }
  },
  methods: {
    propagandize: function () {
      return 'a';
    },
    currlocation: function () {
      return 'a';
    },
    dogify: function () {
      const temp = this.current_weather.temperature;
      let tempDogifyState = 'no';
      if (temp <= 19) // no
        tempDogifyState = 'no';
      else if (temp > 19 && temp <= 44) // maybe
        tempDogifyState = 'maybe';
      else if (temp > 44 && temp <= 60) // yes
        tempDogifyState = 'yes';
      else if (temp > 60 && temp <= 76) // yes
        tempDogifyState = 'yes';
      else if (temp > 76 && temp <= 89) // maybe
        tempDogifyState = 'maybe';
      else if (temp > 89) // no
        tempDogifyState = 'no';

      const aqi = this.aqi
      let aqiDogifyState = 'no'
      if (aqi <= 50)
        aqiDogifyState = 'yes';
      else if (aqi > 50 && aqi <= 100) // yes
        aqiDogifyState = 'yes';
      else if (aqi > 100 && aqi <= 100) // maybe
        aqiDogifyState = 'maybe';
      else if (aqi > 150 && aqi <= 200) // no
        aqiDogifyState = 'no';
      else if (aqi > 200 && aqi <= 300) // no
        aqiDogifyState = 'no';
      else if (aqi > 300) // no
        aqiDogifyState = 'no';

      if (tempDogifyState === 'no' || aqiDogifyState === 'no') {
        return '../img/bt-no.png'
      }
      if (tempDogifyState === 'maybe' || aqiDogifyState === 'maybe') {
        return '../img/bt-maybe.png'
      }
      return '../img/bt-yes.png'
    },
    tempClass: function () {
      const temp = this.current_weather.temperature;
      if (temp === '') return 'dot';

      if (temp <= 19) // no
        return 'dot stupid-cold';
      else if (temp > 19 && temp <= 44) // maybe
        return 'dot cold';
      else if (temp > 44 && temp <= 60) // yes
        return 'dot dress-warmer';
      else if (temp > 60 && temp <= 76) // yes
        return 'dot comfortable';
      else if (temp > 76 && temp <= 89) // maybe
        return 'dot hot';
      else if (temp > 89) // no
        return 'dot stupid-hot';
      else return 'dot';
    },
    aqiClass: function () {
      const aqi = this.aqi
      if (aqi === '') return 'dot';
      if (aqi <= 50)
        return 'dot good'; // yes
      else if (aqi > 50 && aqi <= 100) // yes
        return 'dot moderate';
      else if (aqi > 100 && aqi <= 150) // maybe
        return 'dot sensitive';
      else if (aqi > 150 && aqi <= 200) // no
        return 'dot unhealthy'
      else if (aqi > 200 && aqi <= 300) // no
        return 'dot very-unhealthy'
      else if (aqi > 300) // no
        return 'dot hazardous';
      else return 'dot';
        
    },
    aqiDetailsClass: function (val) {
      if (val === '') return 'good';
      if (aqi <= 50)
        return 'good'; // yes
      else if (aqi > 50 && aqi <= 100) // yes
        return 'moderate';
      else if (aqi > 100 && aqi <= 150) // maybe
        return 'sensitive';
      else if (aqi > 150 && aqi <= 200) // no
        return 'unhealthy'
      else if (aqi > 200 && aqi <= 300) // no
        return 'very-unhealthy'
      else if (aqi > 300) // no
        return 'hazardous';
      else return 'good';
    },
    resetView: function () {
      this.question = true;
    },
    displayQuestionView: function () {
      if (this.question) {
        return 'block';
      } else {
        return 'none'
      }
    },
    displayResultView: function () {
      if (this.question) {
        return 'none';
      } else {
        return 'block'
      }
    },
    getData: function () {
      const isValid = /^[0-9]{5}(?:-[0-9]{4})?$/.test(this.zip);
      if (!isValid)
           return
      const url = `${baseURL}/weather?zipcode=${this.zip}`
      axios.get(url).then((response) => {
        this.current_weather = response.data.current_weather
      }).catch(error => { console.log(error); });

      const qualityUrl  = `${baseURL}/quality?zipcode=${this.zip}`
      axios.get(qualityUrl).then((response) => {
        this.aqi = response.data.aqi;
        this.iaqi = response.data.iaqi;
        this.liberal_propaganda = response.data.liberal_propaganda;
        this.location = response.data.location;
        this.question = false;
      }).catch(error => { console.log(error); });
    }
  }
})

app.component('aqi', {
  data: function () {
    return {
      private: {},
      shared: {
        state: this.$root
      }
    }
  },
  template: '<span v-on:click="shared.state.iaqi_hidden = !shared.state.iaqi_hidden">{{ shared.state.aqi }}</span>'
})

app.component('aqi_details', {
  data: function () {
    return {
      shared: {
        state: this.$root
      }
    }
  },
  methods: {
    detailsClassObject: function (val) {
      return {
        good: val <= 50,
        moderate: val > 50 && val <= 100,
        sensitive: val > 100 && val <= 150,
        unhealthy: val > 150 && val <= 200,
        'very-unhealthy': val > 200 && val <= 300,
        hazardous: val > 300
      }
    },
  },
  template: `<div class="details-container" v-if="!shared.state.iaqi_hidden">
    <ul class="aqi-list">
      <li class="aqi-list-item">
        <div class="list-item-container">
        <div class="pollutant-label">PM2.5</div> <div class="aqi-detail-value" v-bind:class="detailsClassObject(shared.state.iaqi.pm25)">
          {{ shared.state.iaqi.pm25 }}
        </div> 
        <div class="pollutant-description">Fine particulate matter (PM2.5) is an air pollutant that is a concern for people's health when levels in air are high.</div>
        </div>
      </li>
      <li class="aqi-list-item">
       <div class="list-item-container">
        <div class="pollutant-label">PM10</div>
        <div class="aqi-detail-value" v-bind:class="detailsClassObject(shared.state.iaqi.pm10)">{{ shared.state.iaqi.pm10 }}</div>
        <div class="pollutant-description">PM10 are very small particles found in dust and smoke. They have a diameter of 10 micrometres (0.01 mm) or smaller.
        </div>
        </div>
      </li>
      <li class="aqi-list-item">
        <div class="list-item-container">
          <div class="pollutant-label">OZONE</div>
          <div class="aqi-detail-value" v-bind:class="detailsClassObject(shared.state.iaqi.o3)">{{ shared.state.iaqi.o3 }}</div>
          <div class="pollutant-description">Ozone at ground level is a harmful air pollutant, because of its effects on people and the environment, and it is the main ingredient in “smog."
        </div>
        </div>
      </li>
    </ul></div>`
})

app.component('temp', {
  data: function () {
    return {
      private: {},
      shared: {
        state: this.$root
      }
    }
  },
  template: '<span v-on:click="shared.state.weather_details_hidden = !shared.state.weather_details_hidden;">{{ shared.state.current_weather.temperature }}</span>'
})

app.component('weather_details', {
  data: function () {
    return {
      private: {},
      shared: {
        state: this.$root
      }
    }
  },
  methods: {
    setImage: function() {
      return '../img/' + this.$root.current_weather.sky + '.png';
    }
  },

  //{{ shared.state.current_weather.sky }}
  template: `<div class="details-container" v-if="!shared.state.weather_details_hidden">
    <ul class="Weather-list">
      <li class="weather-list-item">
        <img v-bind:src="setImage()" style="width:80px">
        {{ shared.state.current_weather.description }}
      </li>
      <li class="weather-list-item">
        <img src="../img/feelsLike.png" style="width:100px"> Feels Like
        {{ shared.state.current_weather.feels_like }}
       &#176;
      </li>
      <li class="weather-list-item">
        <div class="c100 p100 center" style="float:left">
        <span>{{ shared.state.current_weather.humidity }}%</span> 
        <div class="slice">
            <div class="bar"></div>
            <div class="fill"></div>
        </div>
        </div> 
        <div class="weather-description">Humidity</div>
      </li>
    </ul></div>`
})

app.component('liberal_propaganda', {
  methods: {
    propagandize: function() {
      const propagandas = [
        'Woof Woof! The 20 warmest years on record have been in the past 22 years!',
        'Woof Woof! Inhaling air pollution takes away at least 1-2 years of a typical human life!',
        'Woof Woof! Pollutants that are released into the air, as opposed to land and water pollutants, are the most harmful!',
        'Woof Woof! Deaths caused by air pollution cost the European Union €161 billion!'
        // add items to the list here
      ]
      return propagandas[Math.floor(Math.random() * propagandas.length)];
    }
  },
  data: function () {
    return {
      shared: {
        state: this.$root
      }
    }
  },
  template: '<div v-if="!shared.state.question">{{ propagandize() }}</div>'
})

app.component('current_location', {
  methods: {
    currlocation: function() {
      const loc = this.$root.location;
      return loc.adminArea4 + " " + loc.adminArea4Type + ", " + loc.adminArea3;
    }
  },
  data: function () {
    return {
      shared: {
        state: this.$root
      }
    }
  },
  template: '<span v-if="!shared.state.question"> {{ currlocation() }}</span>'
})

app.mount('#app');
app.config.devtools = true;
