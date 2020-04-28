Vue.component('upvote-counter', {
  data: function () {
    let obj = {
      count: 0
    }
    return obj
  },
  template: '<button v-on:click="count++">{{ count }} ⬆️</button>'
})

Vue.component('downvote-counter', {
  data: function () {
    let obj = {
      count: 0
    }
    return obj
  },
  template: '<button v-on:click="count++">{{ count }} ⬇️</button>'
})

let app = new Vue ({
  el: '#app',
  data: {
    myData: 'Neshota Base'
  }
})