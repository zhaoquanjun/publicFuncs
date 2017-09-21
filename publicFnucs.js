(function (window) {

    /*
    * @name 公用方法库
    * @ PublicMain 是一个初始化之后的类
    * @mobileMatch  适配mobile端的方法，可以通过 PublicMain().mobileMatch()调用。
    * @baseBus  -> 主线程，用于在某些行为发生前控制 baseBus(c1,c2,f1,f2)
    *               -> c1/c2是传入判断状态,前后值可进行对比，诱发后续参数 f1/f2两个参数的执行
    */
    var PublicMain = function(opts){
        if(!(this instanceof PublicMain))return new PublicMain(opts);

        this.opts = this.extend({
            desW:750
        },opts);

        this.init();
    };

    PublicMain.prototype = {
        constructor: PublicMain,
        init:function () {
            this.mobileMatch();

        },
        mobileMatch:function (){
            var winW = document.documentElement.clientWidth;
            document.documentElement.style.fontSize = winW / this.opts.desW * 100 + 'px';
        },
        baseBus:function (c1,c2,f1,f2) {
            if(c1 == c2){
                f1 && f1();
                f2 && f2();
                return false;
            }
        },
        extend:function(obj1,obj2){
            for(var k in obj2){
                obj1[k] = obj2[k]
            }
            return obj1
        },

    };


    /*
    *  @name common弹窗
    *  @boxDom 弹窗外壳
    *  @options -> 需要传入一些参数类似于img、title、des ...
    *     @className 浮层的类名
    *     @createDom 要创建的DOM 一个数组[{ele:'p',attr:''},{...}]；内容是key-value形式，可以一起设置DOM所可以增加的属性（className、id...）
    *     @imgSrc  要显示图片的链接
    *     @boxDomStyle 浮层容器css样式； ——> 其他的样式均设置className之后在外联css中设置
    */

    var MaskShare = function(targetDom,options){

      if(!(this instanceof MaskShare))return new MaskShare(targetDom,options);

      this.options = this.extend({className: 'floorContainer'},options);

      if((typeof targetDom) === "string"){
        this.targetDom = document.querySelector(targetDom)
      }else{
        this.targetDom = targetDom
      }

      var boxDom = document.createElement('div');
      this.boxDom = boxDom;
      boxDom.className = this.options.className;
      //设置外壳的样式，注意z-index的层级问题
      boxDom.style.cssText = 'display: none; position: absolute; left: 0; top: 0; width:100%; height: 100%; background: rgba(0,0,0,.8); z-index: 999;';
      //如果设置的默认样式不能满足需求，那么追加或者重新设置样式，相同的会覆盖默认的值
      this.options.boxDomStyle && this.setStyle(boxDom,this.options.boxDomStyle);

      this.init();
    };

    MaskShare.prototype = {
      init:function(){
        this.event();
        this.map(this.options);
      },
      extend:function(obj1,obj2){
        for(var k in obj2){
          obj1[k] = obj2[k]
        }
        return obj1
      },
      create:function(ele,father){
        for(var i = 0; i < ele.length; i++){
          var curr = ele[i]
          var createDomEle = curr.ele;
          var a = document.createElement(createDomEle)
          this.setAttr(a,curr)
          father.appendChild(a)
        }
      },
      map:function(obj){
        for(var key in obj){
          /^create/.test(key) && this.create(this.options.createDom,this.boxDom);
        }
      },
      setStyle:function(dom,objStyle){
        for(var k in objStyle){
          dom.style[k] = objStyle[k]
        }
      },
      setAttr:function(dom,objStyle){
        for(var k in objStyle){
          if(k !== 'ele'){
            dom[k] = objStyle[k]
          }
        }
      },
      show:function(){
        this.setStyle(this.boxDom,{
          display: 'block'
        })
      },
      hide:function(){
        this.setStyle(this.boxDom,{
          display: 'none'
        })
      },
      event:function(){
        var _this = this;
        this.targetDom.addEventListener('click',function(){
          document.body.appendChild(_this.boxDom);
          _this.show();
          _this.options.open && _this.options.open();
          _this.boxDom.addEventListener('click',function(){
              _this.hide();
              _this.options.close && _this.options.close();
          })
        },false)
      }
    };




    new PublicMain();
    window.PublicMain = PublicMain;
    window.MaskShare = MaskShare;
})(window);
