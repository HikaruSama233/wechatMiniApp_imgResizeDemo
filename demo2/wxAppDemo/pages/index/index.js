//var util = require('../../utils/util.js')
const app = getApp();

Page({
    data: {
        windowWidth: 0,
        windowHeight: 0,
        contentHeight: 300,
        contentWidth:300,
        text: "不要给我看奇怪的东西哦🐶"
    },

    onLoad: function (options) {
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    contentHeight: res.windowHeight / 3,
                    offset: (res.windowWidth - 300) / 2
                });
            }
        });
    },

    getData: function () {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    tempFilePaths: res.tempFilePaths[0],
                    text: '结果即将显示在这里……'
                });
                that.createNewImg(that.data.tempFilePaths);
                //that.uploadPic();        
            }
        })
        
        
    },

    

    createNewImg: function (imgPath) {
        let that = this;
        let ctx = wx.createCanvasContext('myCanvas');
        that.setData({ contentHeight: that.data.windowHeight });
        wx.getImageInfo({
            src: imgPath,
            success: function (image_res) {
                let scale = image_res.width / image_res.height
                that.setData( {
                    contentWidth: 300,
                    contentHeight: 300/scale
                })
                ctx.drawImage(imgPath, that.data.offset, 0, that.data.contentWidth, that.data.contentHeight);
                ctx.draw(false,function() {
                    that.uploadPic()
                } )
            }
        })
        
    },

    uploadPic: function () {
        let that = this;
        wx.canvasGetImageData({
        //wx.canvasToTempFilePath({
            x: that.data.offset,
            y: 0,
            width: that.data.contentWidth,
            height: that.data.contentHeight,
            canvasId: 'myCanvas',
            fileType:'jpg',
            success: function (res) {
                console.log('get!')
                const arrayBuffer = new Uint8Array(res.data)
                var base64 = wx.arrayBufferToBase64(arrayBuffer)
                //console.log(base64)
                wx.request({
                    url: '*******',
                    method: 'POST',
                    head: {
                    'content-type': 'application/json',
                    'user-agent': 'Web Browser'
                    },
                    data: {
                    'jpgBase64': base64
                    },
                    success: function(res) {
                        console.log('success!')
                        console.log(res.data)
                        that.setData({
                            text: res.data.class
                        })
                    },
                    fail(e){
                        console.log(e)
                    }
                })
            //   wx.saveImageToPhotosAlbum({
            //       filePath: res.tempFilePath,
            //       success: function() {
            //           console.log("save!")
            //       }
            //   })
              //util.savePicToAlbum(res.tempFilePath)
            },
            fail(e) {
                console.log(e)
            }
        })
    }
});