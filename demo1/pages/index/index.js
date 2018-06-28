//index.js
//获取应用实例
var imageUtil = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    imagewidth: 1,
    imageheight: 1,
    text: '不要给我看奇怪的东西哦>.<',
    hidden: false
  },
  //事件处理函数

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  chooseImage: function () {
    var _this = this
    wx.chooseImage({
      count: 1,
      //sizeType: 'original',
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          tempFilePaths: res.tempFilePaths,
          text: '结果即将显示在这里……'
        })
        _this.drawCanvas()
        
      }
    })
   

        // wx.request({
        //   url: res.tempFilePaths[0],
        //   method:'get',
        //   responseType: 'arraybuffer',
        //   success: function(data) {
        //     console.log('success!')
        //     var base64 = wx.arrayBufferToBase64(data.data)
        //     wx.request({
        //       url: '*********',
        //       method: 'post',
        //       head: {
        //         'content-type': 'application/json',
        //         'user-agent': 'Web Browser'
        //       },
        //       data: {
        //         'jpgBase64': base64
        //       },
        //       success: function(res) {
        //         console.log('success!')
        //         _this.setData({
        //           text: res.data.class
        //         })
        //       }
        //     })
        //   }
        // })
        

  //     }
  //   })
  },
  // imageLoad: function (e) {
  //   var imageSize = imageUtil.imageUtil(e)
  //   console.log('imageLoad')
  //   this.setData({
  //     imagewidth: imageSize.imageWidth,
  //     imageheight: imageSize.imageHeight
  //   })
  // },

  drawCanvas: function(){
    const ctx = wx.createCanvasContext('dummyCanvas')
    let that = this
    wx.getImageInfo({
      src: that.data.tempFilePaths[0],
      success: function (image_res) {
        if (image_res.width > 200 || image_res.height > 200) {
          let scale = image_res.width/image_res.height
          that.setData( {
            imagewidth: 200,
            imageheight: 200/scale
          })
        } else {
          that.setData( {
            imagewidth: image_res.width,
            imageheight: image_res.height
          })
        }
        console.log(that.data)
        ctx.drawImage(that.data.tempFilePaths[0], 0, 0, that.data.imagewidth, that.data.imageheight)
        ctx.draw(false, function() {
          console.log('start2draw')
          var st = setTimeout(function() {
          wx.canvasGetImageData({
            canvasId: "dummyCanvas",
            x:0,
            y:0,
            weidth: that.data.imagewidth,
            height:  that.data.imageheight,
            success () { 
              console.log("draw_res.data")
            },
            fail() {
              console.log("getImageData fail")
            }
          })
          clearTimeout(st)
        }, 200)
        })
        
      },
      fail() {
        console.log("getImageInfo fail")
      }
    })
    
    
  }
  
})
