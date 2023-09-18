import simplebar from "simplebar-vue";
import "simplebar-vue/dist/simplebar.min.css";

const simpleBarPlugins = {};
simpleBarPlugins.install = function (app) {
  app.component('g-simplebar', simplebar);
};
export default simpleBarPlugins;
