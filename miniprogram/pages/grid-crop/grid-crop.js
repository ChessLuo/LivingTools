// miniprogram/pages/grid-crop/grid-crop.js
let _this;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    canvasWH: '',
    imgW: 0,
    imgH: 0,
    uploadFlag: false,
    imgUrls: [],
    maxHeight: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    _this = this
    _this.setMaxHeight()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /* 设置显示图片的最大高度为屏幕高 */
  setMaxHeight() {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        const windowH = res.windowHeight
        const maxHeight = parseInt(windowH / 3)
        // const statusBar = app.globalData.StatusBar;
        // const customBar = app.globalData.CustomBar;
        // const custom = app.globalData.Custom;
        // const status = parseInt(statusBar) + parseInt(customBar) + parseInt(custom);
        _this.setData({
          maxHeight: `max-height: ${maxHeight}px`
        })
      },
    })
  },

  /* 上传图片 */
  uploadImg() {
    const query = wx.createSelectorQuery()
    query.select('#canvas').boundingClientRect(function(res) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        // sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // 图片大小限制为 最大2M
          const imgSize = res.tempFiles[0].size
          console.log(res, imgSize, '已选择图片大小')

          if (imgSize > 2000000) {
            wx.showModal({
              title: '温馨提示',
              content: '图片最大不能超过2M',
              showCancel: false
            })
            return
          }

          const ctx = wx.createCanvasContext('canvasIn')
          const canvasW = res.width
          const canvasH = res.height
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, canvasW, canvasH)
          ctx.draw()

          // 获取图片信息
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success(imgInfo) {
              console.log(imgInfo, 'imgInfo')
              const imgW = imgInfo.width;
              const imgH = imgInfo.height;

              _this.setData({
                canvasWH: `width: ${imgW}px;height: ${imgH}px;
`,
                imgW,
                imgH
              })

              //  获取图片的大小
              ctx.drawImage(res.tempFilePaths[0], 0, 0, imgW, imgH)
              ctx.draw()
              //  展示新图片
              _this.showMiniImg()
            },
            fail(err) {
              console.log(err, '图片信息获取失败:'+JSON.stringify(err))
              wx.showModal({
                title: '温馨提示',
                content: '暂不支持此图片格式:' + JSON.stringify(err),
                showCancel: false
              })
            }
          })
        },
        fail(err) {
          console.log(err, '图片选择失败')
        }
      })
    })
    query.exec()
  },

  /* 展示小图 */
  showMiniImg() {
    let x = 0
    let y = 0
    let count = 0
    let imgUrls = []
    const {
      imgW,
      imgH
    } = _this.data

    const cutW = imgW / 3
    const cutH = imgH / 3

    const cfgSave = {
      x: 0,
      y: 0,
      width: cutW,
      height: cutH,
      destWidth: cutW,
      destHeight: cutH,
      canvasId: 'canvasIn'
    }
    _this.cutFlag = true

    const timer = setInterval(() => {
      if (_this.cutFlag) {
        _this.cutFlag = false
        console.log(count, 'cutFlag')
        switch (count) {
          case 0:
            x = 0
            y = 0
            break
          case 1:
            x = 1
            y = 0
            break
          case 2:
            x = 2
            y = 0
            break
          case 3:
            x = 0
            y = 1
            break
          case 4:
            x = 1
            y = 1
            break
          case 5:
            x = 2
            y = 1
            break
          case 6:
            x = 0
            y = 2
            break
          case 7:
            x = 1
            y = 2
            break
          case 8:
            x = 2
            y = 2
            break
          default:
            break
        }
        cfgSave.x = cutW * x
        cfgSave.y = cutH * y

        wx.canvasToTempFilePath({
          ...cfgSave,
          success(res) {
            console.log(res, '剪切')

            _this.cutFlag = true
            count++
            wx.showLoading({
              title: `裁剪中 ${count}/9`,
              mask: true
            })
            imgUrls.push(res.tempFilePath)
            if (count == 9) {
              if (imgUrls.length < 9) {
                imgUrls = []
                cut()
                return
              }
              wx.hideLoading()
              _this.setData({
                uploadFlag: true,
                imgUrls
              })
              clearInterval(timer)
            }
          },
          fail(err) {
            console.log(err, '剪切图片失败')
          }
        })
      }
    }, 100)
  },







  /* 一键保存 */
  saveAll() {
    const {
      uploadFlag
    } = _this.data
    // 判断是否已上传图片
    if (uploadFlag) {
      _this.photoAuthorization()
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '请先上传图片',
        showCancel: false
      })
    }
  },


  /* 相册授权 */
  photoAuthorization(event) {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已授权
          if (event) {
            _this.saveImgHandle(event)
          } else {
            _this.saveImgHandle()
          }
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 已授权
              if (event) {
                _this.saveImgHandle(event)
              } else {
                _this.saveImgHandle()
              }
            },
            fail() {
              // 未授权
              wx.showModal({
                title: '温馨提示',
                content: '需要获取相册权限',
                success(resOpenSetting) {
                  if (resOpenSetting.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          // 已授权
                          if (event) {
                            _this.saveImgHandle(event)
                          } else {
                            _this.saveImgHandle()
                          }
                        } else {
                          wx.showModal({
                            title: '温馨提示',
                            content: '未获取到授权信息',
                            showCancel: false
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },

  /* 保存单张图片 */
  // saveImg(e) {
  //   const {
  //     uploadFlag
  //   } = _this.data
  //   // 判断是否已上传图片
  //   if (uploadFlag) {
  //     wx.showModal({
  //       title: '温馨提示',
  //       content: '要将该图片保存到相册吗？',
  //       success(confirm) {
  //         if (confirm.confirm) {
  //           _this.photoAuthorization(e)
  //         }
  //       }
  //     })

  //   } else {
  //     wx.showModal({
  //       title: '温馨提示',
  //       content: '请先上传图片',
  //       showCancel: false
  //     })
  //   }

  // },

  /* 保存图片(单图 / 所有) */
  saveImgHandle(e) {
    const {
      imgW,
      imgH,
      imgUrls
    } = _this.data

    const cutW = imgW / 3
    const cutH = imgH / 3

    const cfgSave = {
      x: 0,
      y: 0,
      width: cutW,
      height: cutH,
      destWidth: cutW,
      destHeight: cutH,
      canvasId: 'canvasIn',
    }

    if (e) { //保存单张图片
      switch (e.currentTarget.dataset.idx) {
        case 1:
          cfgSave.x = cutW * 0
          cfgSave.y = cutH * 0
          break
        case 2:
          cfgSave.x = cutW * 1
          cfgSave.y = cutH * 0
          break
        case 3:
          cfgSave.x = cutW * 2
          cfgSave.y = cutH * 0
          break
        case 4:
          cfgSave.x = cutW * 0
          cfgSave.y = cutH * 1
          break
        case 5:
          cfgSave.x = cutW * 1
          cfgSave.y = cutH * 1
          break
        case 6:
          cfgSave.x = cutW * 2
          cfgSave.y = cutH * 1
          break
        case 7:
          cfgSave.x = cutW * 0
          cfgSave.y = cutH * 2
          break
        case 8:
          cfgSave.x = cutW * 1
          cfgSave.y = cutH * 2
          break
        case 9:
          cfgSave.x = cutW * 2
          cfgSave.y = cutH * 2
          break
        default:
          break
      }
      wx.canvasToTempFilePath({
        ...cfgSave,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(resPhoto) {
              wx.showToast({
                title: '保存成功'
              })
            }
          })
        }
      })
    } else { //保存所有
      let pathArr = []
      let x = 0
      let y = 0
      let count = 0
      _this.saveFlag = true

      const timer = setInterval(() => {
        if (_this.saveFlag) {

          _this.saveFlag = false
          console.log(count, 'saveFlag')
          switch (count) {
            case 0:
              x = 0
              y = 0
              break
            case 1:
              x = 1
              y = 0
              break
            case 2:
              x = 2
              y = 0
              break
            case 3:
              x = 0
              y = 1
              break
            case 4:
              x = 1
              y = 1
              break
            case 5:
              x = 2
              y = 1
              break
            case 6:
              x = 0
              y = 2
              break
            case 7:
              x = 1
              y = 2
              break
            case 8:
              x = 2
              y = 2
              break
            default:
              break
          }
          cfgSave.x = cutW * x
          cfgSave.y = cutH * y
          wx.canvasToTempFilePath({
            ...cfgSave,
            success(res) {
              console.log(res, '保存所有')

              pathArr.push(res.tempFilePath)
              count++
              wx.showLoading({
                title: `保存中${count}/9`,
              })
              _this.saveFlag = true
              if (count == 9) {
                clearInterval(timer)
                console.log(pathArr)
                // 保存到相册
                for (let i = 0; i < pathArr.length; i++) {
                  wx.saveImageToPhotosAlbum({
                    filePath: pathArr[i],
                    success(resPhoto) {
                      _this.saveFlag = true
                      if (i == pathArr.length - 1) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '保存成功'
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        }
      }, 100)
    }
  },




})