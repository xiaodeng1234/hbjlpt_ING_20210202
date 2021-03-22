/***
 * 通用接口配置
 */
 export default {
    //获取单位数
    getDwDate: {
      method: 'GET',
      label: '获取单位树',
      endpoint: '/common/dwbmTree'
    },
    //获取申请事项
    getSqsxData: {
      method: 'POSTFORM',
      label: '获取申请事项',
      endpoint: '/overview/getApplyMatter',
    },
    //获取刑事案件专业类型
    getXsajzylxData: {
      method: 'POSTFORM',
      label: '获取刑事案件专业类型',
      endpoint: '/overview/getAjlxInfo'
    },
    //获取办理环节
    getBlhjData: {
      method: 'POSTFORM',
      label: '获取办理环节',
      endpoint: '/overview/getHandlLinks'
    }
  }
    
    export const ENV = REMOTE_ADDR