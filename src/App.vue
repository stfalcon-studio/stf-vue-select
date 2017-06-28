<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>stf-vue-select - the most flexible vue select</h1>
    <br>
    <stf-select style="width: 300px; margin: 0 auto">
      <div slot="label">Введите адес погрузки</div>
      <div slot="value">value</div>
      <section class="options delivery_order__options">
          <stf-select-option  
          :value="item" v-for="item of list" :key="item.id">
              <span>{{item.text}} (<small>{{item.address}}</small>)</span>
          </stf-select-option>
      </section>
    </stf-select>
  </div>
</template>

<script>
import {StfSelect, StfSelectOption} from './components/stf-select'

export default {
  name: 'app',
  components: {
    StfSelect, 
    StfSelectOption
  },
  data: function () {
    return {
      list: [
        {
          text: "text1",
          address: "address1",
          id: 1
        },
        {
          text: "text2",
          address: "address2",
          id: 2
        },
      ]
    }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
