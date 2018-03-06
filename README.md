# stf vue select VUE2

[![Join the chat at https://gitter.im/stfalcon-studio/stf-vue-select](https://badges.gitter.im/stfalcon-studio/stf-vue-select.svg)](https://gitter.im/stfalcon-studio/stf-vue-select?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> stf vue select - most flexible and customized select

For detailed explanation on how things work, checkout the [DEMO](https://stfalcon-studio.github.io/stf-vue-select/dist/)

## install

``` bash
# install 
npm install stf-vue-select --save


```
## import 
``` js

import {StfSelect, StfSelectOption} from "stf-vue-select";
import "stf-vue-select/dist/lib/stf-vue-select.min.css";

...

Vue.component('stf-select-option', StfSelectOption);
Vue.component('stf-select', StfSelect);


```

## Using without webpack minified files

``` js
<script src="./dist/lib/stf-vue-select.min.js"></script>

Vue.use(StfSelectPlugin) 

```

## usage

``` html
    <template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>stf-vue-select - the most flexible vue select</h1>
    <br>
    <label>Select without input</label>
    <stf-select v-model="value" style="width: 300px; margin: 0 auto">
      <div slot="label">Input address</div>
      <div slot="value">
        <div v-if="value">
           <span>{{value.address}} (<small>{{value.text}}</small>)</span>
        </div>
      </div>
      <section class="options delivery_order__options">
          <stf-select-option  
           v-for="item of list" :key="item.id"
           :value="item"
           :class="{'stf-select-option_selected': item.id === (value && value.id)}" 
           >
              <span>{{item.text}} (<small>{{item.address}}</small>)</span>
          </stf-select-option>
      </section>
    </stf-select>

    <br>
    <label>Select with input</label>
    <stf-select v-model="value" style="width: 300px; margin: 0 auto">
      <div slot="label">Input address</div>
      <div slot="value">
        <div v-if="value">
           <span>{{value.address}} (<small>{{value.text}}</small>)</span>
        </div>
      </div>
      <div slot="search-input">
          <input @input="onsearch">
      </div>
      <section class="options delivery_order__options">
          <stf-select-option  
           v-for="item of listFinded" :key="item.id"
           :value="item"
           :class="{'stf-select-option_selected': item.id === (value && value.id)}" 
           >
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
  created() {
    this.listFinded = this.list;
  },
  data () {
    return {
      value: null,
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
        {
          text: "text3",
          address: "address3",
          id: 3
        },
      ],
      listFinded: [
      ]
    }
  },
  methods: {
    onsearch(e) {
      if (e.target.value) {
        this.listFinded = this.list.filter(el => el.text.indexOf(e.target.value) !== -1 || el.address.indexOf(e.target.value) !== -1);
      } else {
        this.listFinded = this.list;
      }
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


```

## options
```js
props: {
    value: [Object, Number, String, Array, Boolean],
    more: Boolean,
    pending: Boolean,
    optionsWrapClass: String,
    needFocusInpOnTab: {
        type: Boolean,
        default: false
    },
},

```


For detailed explanation on how things work, checkout the [DEMO](https://stfalcon-studio.github.io/stf-vue-select/dist/)
