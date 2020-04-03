/*!
 * CardPicker.js v1.0.1
 * (c) 2020 ShuFei
 * Released under the MIT License.
 */
function CardPicker(options) {
  this.selectedList = []
  this.selectedTarget = null
  this.$options = {
    isShowControl: false,
    level: -1,
    caseName: {
      text: 'text',
      children: 'children'
    },
    isFullScreen: false,
    title: ''
  }
  this._init(options)
}

CardPicker.prototype._init = function (options) {
  this.optionsMerge(options)
  this.triggerOptionsVerify()
  this.dataOptionsVerify()
  this.trigger.addEventListener('click', () => {
    this.createContainer()
  })
}

CardPicker.prototype.optionsMerge = function (options) {
  CardPicker.prototype.$options = this.util.m(this.$options, options)
}

CardPicker.prototype.triggerOptionsVerify = function () {
  if ('trigger' in this.$options) {
    let t = this.$options.trigger
    if (typeof t == 'string') {
      let trigger = document.querySelector(t)
      if (trigger) {
        CardPicker.prototype.trigger = trigger
      } else {
        console.error(`[CardPicker warn]: ${t}  is not a valid selector.`)
      }
    } else {
      if (t) {
        CardPicker.prototype.trigger = t
      } else {
        console.error('[CardPicker warn]: Can not resolve the trigger DOM.')
      }
    }
  } else {
    console.error('[CardPicker warn]:The parameter item trigger is required.')
  }
}

CardPicker.prototype.dataOptionsVerify = function () {
  if ('list' in this.$options) {
    if (this.$options.list.length == 0) {
      console.error('[CardPicker warn]:The parameter item ` list ` is empty.')
    }
  } else {
    console.error('[CardPicker warn]:The parameter item ` list ` is required.')
  }
}

CardPicker.prototype.initView = function () {
  this.updateTabView()
  this.updateListView()
}

CardPicker.prototype.initEventsConfig = function () {
  this.tabContainer = new BScroll(this.util.g('.rookie-tab'), {
    scrollX: true,
    scrollY: false,
    momentum: true,
    tap: true,
    stopPropagation: false
  });
  this.listContainer = new BScroll(this.$cache.listWrpper, {
    scrollX: false,
    scrollY: true,
    momentum: true,
    tap: true,
    stopPropagation: false
  });
}

CardPicker.prototype.initEvents = function () {

  this.util.g('.rookie-mask').addEventListener('touchmove', function (e) {
    e.preventDefault()
  }, false)
  this.util.g('.rookie-mask').addEventListener('click', e => {
    e.stopPropagation()
    e.preventDefault()
    this.util.g('.rookie-content').classList.remove('rookie-picker-modal-visible')
    setTimeout(() => {
      document.body.removeChild(document.querySelector('.rookie-container'))
    }, 300)
  }, false)

  this.$cache.tab.addEventListener('tap', e => {
    e.stopPropagation()
    e.preventDefault()
    let selectLen = this.selectedList.length
    let target = e.target
    if (target.classList.contains('rookie-tab-item')) {
      if (selectLen == 0) { //点击第一项 
        this.util.g('.rookie-tab-opactiy').classList.remove('rookie-tab-opactiy')
        this.selectedList.splice(0)
      } else {
        if (target.classList.contains('rookie-tab-last')) {
          if (target.innerHTML === '请选择') return;
        } else {
          this.util.g('.rookie-tab-opactiy').classList.remove('rookie-tab-opactiy')
          let txt = target.innerHTML
          let index = this.selectedList.indexOf(txt)
          this.selectedList.splice(index)
        }
      }
    }
  }, false)

  this.$cache.ul.addEventListener('tap', e => {
    e.stopPropagation()
    e.preventDefault()
    if (this.util.g('.rookie-tab-last').innerHTML == '请选择') {
      try {
        this.util.g('.rookie-tab-opactiy').classList.remove('rookie-tab-opactiy')
      } catch (error) {
      }
      this.selectedList.push(e.target.innerHTML)
    } else {
      try {
        this.util.g('.rookie-tab-opactiy').classList.remove('rookie-tab-opactiy')
      } catch (error) {
      }
      this.selectedList.splice(this.selectedList.length - 1, 1, e.target.innerHTML)
    }
    if (this.$options.level != -1 && this.$options.level == this.selectedList.length) {
      this.$options.success && this.$options.success(this.selectedList, this.selectedTarget)
      this.util.g('.rookie-content').classList.remove('rookie-picker-modal-visible')
      setTimeout(() => {
        document.body.removeChild(document.querySelector('.rookie-container'))
      }, 300)
    }
  }, false)
  this.$options.isShowControl && this.util.g('.rookie-control-confirm').addEventListener('click', e => {
    e.stopPropagation()
    e.preventDefault()
    if (!this.selectedList.length && !this.selectedTarget) return;
    this.$options.success && this.$options.success(this.selectedList, this.selectedTarget)
    this.selectedList = []
    this.selectedTarget = null
    this.util.g('.rookie-content').classList.remove('rookie-picker-modal-visible')
    setTimeout(() => {
     
      document.body.removeChild(document.querySelector('.rookie-container'))
    }, 300)
  }, false)

  this.$options.isShowControl&&this.util.g('.rookie-control-cancel').addEventListener('click', e => {
    e.stopPropagation()
    e.preventDefault()
    this.util.g('.rookie-content').classList.remove('rookie-picker-modal-visible')
    setTimeout(() => {
      document.body.removeChild(document.querySelector('.rookie-container'))
    }, 300)
  }, false)
}
CardPicker.prototype.updateListView = function (list) {

  this.$cache.ul.innerHTML = list ? list.reduce((p, c) => p += `<li class="${this.$options.caseName && this.$options.caseName.children && c[this.$options.caseName.children]?'arrow':''}">${c[this.$options.caseName.text]}</li>`, '') : this.$options.list.reduce((p, c) => p += `<li class="${this.$options.caseName && this.$options.caseName.children && c[this.$options.caseName.children]?'arrow':''}">${c[this.$options.caseName.text]}</li>`, '')
}
CardPicker.prototype.updateTabView = function (isReset = false) {
  let html = ''
  if (!isReset) {
    if(this.$options.level==2){
      for (let i = 0; i < this.selectedList.length; i++) {
        html += `<div class="rookie-tab-item rookie-tab-selected" style="width:40vw;">${this.selectedList[i]}</div>`
      }
    }else{
      for (let i = 0; i < this.selectedList.length; i++) {
        html += `<div class="rookie-tab-item rookie-tab-selected">${this.selectedList[i]}</div>`
      }
    }
    
  }
  if(this.$options.level==2){
    
      html += `<div class="rookie-tab-item rookie-tab-active rookie-tab-last" style="width:40vw;">请选择</div>`
    
  }else{

    html += `<div class="rookie-tab-item rookie-tab-active rookie-tab-last">请选择</div>`
  }
  this.$cache.tab.innerHTML = html

  this.tabContainer && this.tabContainer.refresh()
  this.tabContainer && this.tabContainer.scrollTo(-this.util.g('.rookie-tab-wrapper').offsetWidth, 0, 0)
  setTimeout(() => {
    this.util.g('.rookie-tab-wrapper').classList.add('rookie-tab-opactiy')
  }, 300)
}

CardPicker.prototype.util = {
  g(selector, isAll) {
    return document[isAll ? 'querySelectorAll' : 'querySelector'](selector)
  },
  m(f, s) {
    for (var i in s) {
      f[i] = f[i] && f[i].toString() === "[object Object]" ? this.m(f[i], s[i]) : f[i] = s[i]
    }
    return f
  }
}
CardPicker.prototype.queryList = function () {
  let CloneList = this.$options.list.slice()
  let CloneSelectedList = this.selectedList.slice()
  let ListRender = []
  let fn = list => {
    for (let i = 0; i < CloneSelectedList.length; i++) {
      let ObjectList = list.find(item => item[this.$options.caseName.text] == CloneSelectedList[0])
      this.selectedTarget = ObjectList
      ListRender = ObjectList[this.$options.caseName.children] ? ObjectList[this.$options.caseName.children] : []

      if (CloneSelectedList.length > 1) {
        CloneSelectedList.splice(0, 1)
        fn(ListRender)
      }
    }
  }
  fn(CloneList)
  return ListRender
}
CardPicker.prototype.initArrayListener = function () {
  let that = this
  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);
  const newArrProto = [];
  ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => { // 原生Array的原型方法
    let original = arrayMethods[method];
    newArrProto[method] = function mutator() {
      original.apply(this, arguments);
      return that.notify(method, ...arguments)
    }
  })
  this.selectedList = []
  this.selectedList.__proto__ = newArrProto;
}
CardPicker.prototype.notify = function () {
  let [type, value] = [...arguments]
  let RenderList = this.queryList()
  if (type == 'push') {
    if (RenderList.length == 0) {
      this.util.g('.rookie-tab-last').innerHTML = this.selectedList[this.selectedList.length - 1]
      setTimeout(() => {
        this.util.g('.rookie-tab-wrapper').classList.add('rookie-tab-opactiy')
      }, 300)
    } else {
      this.updateListView(RenderList)
      this.updateTabView()
    }
  } else if (type == 'splice') {
    if (this.util.g('.rookie-tab-last').innerHTML != '请选择') {
      if (RenderList.length == 0) {

        if (Object.prototype.toString.call(this.selectedTarget) === "[object Object]" && this.selectedList.length == 0 && value == 0) {
          this.selectedTarge = null
          this.updateTabView(true)
          this.updateListView()
        } else {
          this.util.g('.rookie-tab-last').innerHTML = this.selectedList[this.selectedList.length - 1]
          this.tabContainer && this.tabContainer.scrollTo(-this.util.g('.rookie-tab-wrapper').offsetWidth, 0, 0)
          setTimeout(() => {
            this.util.g('.rookie-tab-wrapper').classList.add('rookie-tab-opactiy')
          }, 300)
        }
      } else {
        this.updateTabView()
        this.selectedTarget.children && this.updateListView(this.selectedTarget.children)
      }
    } else {
      if (value == 0) {
        this.updateTabView(true)
        this.updateListView()
      } else {
        if (RenderList.length == 0) {
          this.updateTabView()
          this.updateListView(RenderList)
        } else {
          this.updateTabView()
          this.selectedTarget.children && this.updateListView(this.selectedTarget.children)
        }
      }
    }

  }
}
CardPicker.prototype.createContainer = function () {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="rookie-container weui-picker-modal">
  <div class="rookie-mask">
  </div>
  <div class="rookie-content">
  <div class="rookie-hd">
  ${this.$options.title.length?`<div class="rookie-title">${this.$options.title}</div>`:''}
  ${this.$options.isShowControl?'<div class="rookie-control"><button class="rookie-control-cancel">取消</button><button class="rookie-control-confirm">确定</button></div>':''}
  <div class="rookie-tab-view"><div class="rookie-tab"><div class="rookie-tab-wrapper"><div class="rookie-tab-item rookie-tab-last rookie-tab-active">请选择</div></div></div></div></div><div class="rookie-bd"><ul class="rookie-bd-ul"></ul></div></div></div>`)
  this.$options.isFullScreen && this.util.g('.rookie-content').classList.add('rookie-full-screen')
  if(this.$options.level==1){
    this.util.g('.rookie-tab-view').style = "display:none;"
  }else if(this.$options.level==2){
    this.util.g('.rookie-tab-last').style = "width:40vw;"
    
  }
  setTimeout(() => {
    this.util.g('.rookie-content').classList.add('rookie-picker-modal-visible')
  }, 0)
  this.$cache = {
    container: document.querySelector('.rookie-container'),
    ul: document.querySelector('.rookie-bd-ul'),
    listWrpper: document.querySelector('.rookie-bd'),
    tab: document.querySelector('.rookie-tab-wrapper'),
  }
  this.initArrayListener()
  this.initView()
  this.initEventsConfig()
  this.initEvents()
}
export default CardPicker