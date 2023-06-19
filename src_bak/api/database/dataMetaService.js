import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  queryNeedByDataSetId: function (id) {
    return request.get(`${prefix}/database/datamodel/dataMeta/queryNeedByDataSetId`, { id });
  },
}
