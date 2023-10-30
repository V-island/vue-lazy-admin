import GSvgIcon from './GSvgIcon.vue';
import GTable from './GTable.vue';
import GModal from './GModal.vue';
import GResult from './GResult.vue';
import GSpin from './GSpin.vue';
import GToolbar from './GToolbar.vue';
import GCard from './GCard.vue';
import GBox from './GBox.vue';
import GFormSearch from './GFormSearch.vue';

const Components = {};
Components.install = function (app) {
  app.component('g-svg-icon', GSvgIcon);
  app.component('g-table', GTable);
  app.component('g-modal', GModal);
  app.component('g-result', GResult);
  app.component('g-spin', GSpin);
  app.component('g-toolbar', GToolbar);
  app.component('g-card', GCard);
  app.component('g-box', GBox);
  app.component('g-form-search', GFormSearch);
};
export default Components;
