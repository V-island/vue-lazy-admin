import GSvgIcon from './GSvgIcon.vue';
import GTable from './GTable.vue';
import GModal from './GModal.vue';
import GDrawer from './GDrawer.vue';
import GResult from './GResult.vue';
import GSpin from './GSpin.vue';
import GToolbar from './GToolbar.vue';
import GCard from './GCard.vue';

const Components = {};
Components.install = function (app) {
  app.component('g-svg-icon', GSvgIcon);
  app.component('g-table', GTable);
  app.component('g-modal', GModal);
  app.component('g-drawer', GDrawer);
  app.component('g-result', GResult);
  app.component('g-spin', GSpin);
  app.component('g-toolbar', GToolbar);
  app.component('g-card', GCard);
};
export default Components;
