//app.js
App({
  onShow:function(options){
    console.log(options);
  },
  onHide(){
    console.log('hide');
  },
  getUserInfo:function(cb){
  },
  globalData:{
    userInfo:null,
    baseUrl:'https://api.it120.cc/jy02149522',
    version: "1.7",
    token:'xiaochengxu',
    shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
    navigate_type:1,
    tlist:[]
  },
  dateToObj(dateObj){
    return JSON.parse(JSON.stringify(dateObj))
  },
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url:  that.globalData.baseUrl +'/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })
    this.getTlist();
  },
  
  //获取类别列表
  getTlist() {
    var self = this;
    wx.request({
      url: self.globalData.baseUrl + '/shop/goods/category/all',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //划分分类
        var _data = res.data.data, _tlist = [];
        //选出一级分类，放入firstType
        for (var x in _data) {
          if (_data[x].pid == 0) {
            _tlist.push({
              firstType: _data[x],
              second: []
            })
          }
          //判断是否存在二级分类
          if (self.globalData.navigate_type == 1 && _data[x].pid != 0){
            self.globalData.navigate_type = 2 ;
          }
        }
        //如果存在二级分类
        if (self.globalData.navigate_type == 2 ){
          //选出二级分类，放入对应的secondList
          for (var x in _data) {
            for (var y in _tlist) {
              if (_data[x].pid == _tlist[y].firstType.id) {
                _tlist[y].second.push(_data[x]);
              }
            }
          }
          //整理二级分类
          for (var x in _tlist) {
            //两行显示
            if (_tlist[x].second.length >= 10) {
              var _slist = _tlist[x].second;
              _tlist[x].secondList = [];
              _tlist[x].thirdList = [];
              for (var y in _slist) {
                if (y % 2) {
                  _tlist[x].thirdList.push(_slist[y]);
                } else {
                  _tlist[x].secondList.push(_slist[y]);
                }
              }
            }
          }
        }else{
          _tlist[0].secondList = [];
          _tlist[0].thirdList = [];
          for (var x in _tlist) {
            //两行显示
            if (_tlist.length >= 10) {
              if (x % 2) {
                _tlist[0].thirdList.push(_tlist[x].firstType);
              } else {
                _tlist[0].secondList.push(_tlist[x].firstType);
              }
            }else{
              _tlist[0].secondList.push(_tlist[x].firstType);
            }
          } 
        }
        self.globalData.tlist = _tlist;
      }
    })
  }
})