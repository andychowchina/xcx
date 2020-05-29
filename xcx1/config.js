/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

//测试地址
  // const host = 'http://192.168.116.120:8080';
  // const host = 'http://192.168.116.107:9003';
  // const host = 'http://192.168.116.119:8080';
const host = 'https://www.gz12366.com.cn:20366';


const hostWeixin = 'http://www.6112366.com:47368';

const config = {

  // 下面的地址配合云端 Server 工作
  host,
  hostWeixin,

  // 授权登录
  saveWxUssaverInfo: host +'/WeChatSys/wxUser/saveWxUserInfo.do?authType=show&decodeUserInfo',

  // 修改个人信息
  updateMyInfo: host +'/WeChatSys/wxUser/updateOne.do?authType=show&decodeUserInfo',

  // 修改昵称信息
  updateNickName: host + '/WeChatSys/wxUser/queryById.do?authType=show&decodeUserInfo',

  // 获取个人信息
  getMyInfo: host + '/WeChatSys/wxUser/queryOne.do?authType=show&decodeUserInfo',
  
  //解密微信小程序获取的手机号
  getUserTel: host + '/WeChatSys/wxUser/AESdecrypt.do?authType=show&decodeUserInfo',

  //查询我的预约
  getMyServiceReservationsl: host + '/WeChatSys/wxServiceReservation/myServiceReservations.do?authType=show&decodeUserInfo',

  //获取咨询信息
  queryRecommendInformations: host + '/WeChatSys/wxInformation/queryRecommendInformations.do?authType=show',
  
  //上传图片
  uploadImageUrl: host + '/WeChatSys/wxImage/uploadImg.do?authType=show',

  //获取详细的资讯信息
  queryInformationLists: host + '/WeChatSys/wxInformation/queryInformationById.do',

  //添加评论
  addInformationComment: host +'/WeChatSys/wxInformationComment/addInformationComment.do',

  //添加三级评论
  addThreeComment: host + '/WeChatSys/wxForuserComment/insertCOmment.do',

  // 查看三级评论 
  showThreeComment: host + '/WeChatSys/wxForuserComment/selectForUserComment.do',

  //查看评论
  selectInformationComment: host + '/WeChatSys/wxInformationComment/selectInformationComment.do',

  //添加用户评论
  addUserComment: host + '/WeChatSys/wxUserComment/addUserComment.do',

  //查新评论的评论
  selectUserComment: host + '/WeChatSys/wxUserComment/selectUserComment.do',

  //更新咨询信息
  updateInformationById: host + '/WeChatSys/wxInformation/updateInformationById.do?authType=show',

  //咨询信息点赞
  infoCommentPraise: host +'/WeChatSys/wxInfoCommentPraise/infoCommentPraise.do?authType=show',

   //给评论的评论点赞.
  userCommentPraise: host + '/WeChatSys/wxUserCommentPraise/userCommentPraise.do',
  // 三级评论点赞
  praiseThreeComment: host + '/WeChatSys/wxUserCommentPraise/ForuserCommentPraise.do',
  
  //关注
  userAttention: host + '/WeChatSys/wxAttention/userAttention.do',

  //获取服务商核心业务
  companyService: host + '/WeChatSys/cooperativeRegister/selectIndustry.do',

  //提交服务商入住申请
  cooperativeApply: host + '/WeChatSys/cooperativeRegister/cooperativeApply.do',

  //获取话题
  getTopics: host + '/WeChatSys/wxTopic/queryTopic.do',

  //获取跟话题有关的咨询
  getDynamicInfoOfTopics: host + '/WeChatSys/wxTopic/queryTopicByTitle.do',

  //查询话题的相关信息
  selectTopicByTytle: host + '/WeChatSys/wxTopic/selectTopicByTytle.do',

  //获取白名单域名
  getPassUr: host +'/WeChatSys/wxDomainWhitelist/selectDominWhiteList.do',

  //获取我的主页信息
  getMyPublicInformations: host + '/WeChatSys/wxInformation/myPublicInformations.do?authType=show',

  //  获取openid用代理
  dailiOpenIdUnionId: hostWeixin + '/register/interfaceGet/getSomething' ,

  // 检测是否登录接口
  loginCheck: host + '/WeChatSys/wxUser/CheckUser.do',

  // 登录注册
  loginRegister: host + '/WeChatSys/wxUser/LoginOrRegister.do',

  // 发送验证码
  sengCode: host + '/WeChatSys/wxUser/fdx.do',

  // 验证码验证
  validateCode: host + '/WeChatSys/wxUser/yzdx.do',

  jiemi: host + '/WeChatSys/wxUser/decryptWxencryptedData.do?authType=show',

  // 获取openid和unionid
  openIdUnionId: host + '/WeChatSys/wxUser/getWxUserIdAndUniid.do'

}

module.exports = config
