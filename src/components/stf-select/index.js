import * as StfSelect from "./StfSelect.vue";
import * as StfSelectOption from "./StfSelectOption.vue";

const StfSelectPlugin = {
  install(Vue, options) {
    Vue.component(StfSelect.name, StfSelect);
    Vue.component(StfSelectOption.name, StfSelectOption);
  }
}

window.StfSelectPlugin = StfSelectPlugin;

export {StfSelectOption, StfSelect, StfSelectPlugin};