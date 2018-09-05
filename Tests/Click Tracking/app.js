// https://codepen.io/keziamydarling/pen/WgOgEJ?editors=1010

new Vue({
  el: '#app',
  data: {
    counter: 1
  },
  methods: {
    clickCounter: function(e) {
      // console.log(this.counter);
      
      // get element of target clicked
      let currentEl = e.target;
      console.log(currentEl);
      // grab root element so all clicks can be tracked
      const html = document.querySelector('html');
      
      // every time the user clicks create a span with incrememting number
      const newCounter = document.createElement('span');
      newCounter.classList.add('clickCounter');
      newCounter.textContent = this.counter;

      currentEl.insertAdjacentElement('afterbegin', newCounter);

      TweenMax.from(newCounter, 1, {opacity: 0, y:10});

      this.counter++

    
    }
  }
});



// TODO
// Pull in kennystephens.com html for test case
// get event.target html element
// insert counter span tag
// add subtle https://greensock.com/gsap animation