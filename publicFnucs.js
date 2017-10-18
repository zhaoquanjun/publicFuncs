(function (window) {


    /*
     @name public methods
     @extend  扩展对象
     @setStyle  设置对象样式
     */

    function extend(obj1, obj2) {
        for (var k in obj2) {
            obj1[k] = obj2[k]
        }
        return obj1
    };


    function setStyle(dom, objStyle) {
        for (var k in objStyle) {
            dom.style[k] = objStyle[k]
        }
    };


    /*
     * @name 公用方法库
     * @ PublicMain 是一个初始化之后的类
     * @mobileMatch  适配mobile端的方法，可以通过 PublicMain().mobileMatch()调用。
     * @baseBus  -> 主线程，用于在某些行为发生前控制 baseBus(c1,c2,f1,f2)
     *               -> c1/c2是传入判断状态,前后值可进行对比，诱发后续参数 f1/f2两个参数的执行
     * @audioAutoPlay -> 解决iOS音频不能自动播放问题
     */
    var PublicMain = function (opts) {
        if (!(this instanceof PublicMain))return new PublicMain(opts);

        this.opts = this.extend({
            desW: 750
        }, opts);

        this.init();
    };

    PublicMain.prototype = {
        constructor: PublicMain,
        init: function () {
            this.mobileMatch();

        },
        mobileMatch: function () {
            var winW = document.documentElement.clientWidth;
            document.documentElement.style.fontSize = winW / this.opts.desW * 100 + 'px';
        },
        baseBus: function (c1, c2, f1, f2) {
            if (c1 == c2) {
                f1 && f1();
                f2 && f2();
                return false;
            }
        },
        audioAutoPlay: function (id) {
            var audioPlayer = document.getElementById(id);
            var play = function () {
                audioPlayer.play();
                document.removeEventListener("touchstart", play, false);
            };
            audioPlayer.play();
            document.addEventListener("WeixinJSBridgeReady", function () {
                play();
            }, false);
            document.addEventListener('YixinJSBridgeReady', function () {
                play();
            }, false);
            document.addEventListener("touchstart", play, false);
        },
        extend: function (obj1, obj2) {
            for (var k in obj2) {
                obj1[k] = obj2[k]
            }
            return obj1
        },

    };


    /*
     *  @name allScreen(全屏)弹窗
     *  @boxDom 弹窗外壳
     *  @options -> 需要传入一些参数类似于img、title、des ...
     *     @className 浮层的类名
     *     @createDom 要创建的DOM 一个数组[{ele:'p',attr:''},{...}]；内容是key-value形式，可以一起设置DOM所可以增加的属性（className、id...）
     *     @imgSrc  要显示图片的链接
     *     @boxDomStyle 浮层容器css样式； ——> 其他的样式均设置className之后在外联css中设置
     */

    var MaskShare = function (targetDom, options) {

        if (!(this instanceof MaskShare))return new MaskShare(targetDom, options);

        this.options = extend({className: 'supernatant'}, options);

        if ((typeof targetDom) === "string") {
            this.targetDom = document.querySelector(targetDom)
        } else {
            this.targetDom = targetDom
        }

        var boxDom = document.createElement('div');
        this.boxDom = boxDom;
        boxDom.className = this.options.className;
        //设置外壳的样式，注意z-index的层级问题
        boxDom.style.cssText = 'display: none; position: absolute; left: 0; top: 0; width:100%; height: 100%; background: rgba(0,0,0,.8); z-index: 999;'
        //如果设置的默认样式不能满足需求，那么追加或者重新设置样式，相同的会覆盖默认的值
        this.options.boxDomStyle && setStyle(boxDom, this.options.boxDomStyle);

        this.init();
    };

    MaskShare.prototype = {
        constructor: MaskShare,
        init: function () {
            this.event();
            this.map(this.options);
        },
        create: function (ele, father) {
            for (var i = 0; i < ele.length; i++) {
                var curr = ele[i]
                var createDomEle = curr.ele;
                var a = document.createElement(createDomEle)
                this.setAttr(a, curr)
                father.appendChild(a)
            }
        },
        map: function (obj) {
            for (var key in obj) {
                /^create/.test(key) && this.create(this.options.createDom, this.boxDom);
            }
        },
        setAttr: function (dom, objStyle) {
            for (var k in objStyle) {
                if (k !== 'ele') {
                    dom[k] = objStyle[k]
                }
            }
        },
        show: function () {
            setStyle(this.boxDom, {
                display: 'block'
            })
        },
        hide: function () {
            setStyle(this.boxDom, {
                display: 'none'
            })
        },
        event: function () {
            var _this = this;
            this.targetDom.addEventListener('click', function () {
                document.body.appendChild(_this.boxDom);
                _this.show();
                _this.options.open && _this.options.open();
                _this.boxDom.addEventListener('click', function () {
                    _this.hide();
                    _this.options.close && _this.options.close();
                })
            }, false)
        }
    };


    /*
     *  @name 小浮层（smallScreen）
     *    tips: 浮层居中显示
     *    @target 触发元素
     *      @opts  传入的参数
     *        {} -> 传入的是一个对象
     *          @ fir  应该至少包含 浮层的文字内容（innerText）
     *          @ sec  至于浮层的样式可以在定义的class中尽情的设定
     */

    var Supernatant = function (target, opts) {
        if (!(this instanceof Supernatant))return new Supernatant(target, opts);

        this.opts = extend({className: 'supernatant'}, opts);

        if ((typeof target) === "string") {
            this.target = document.querySelector(target)
        } else {
            this.target = target
        }

        var supernatantHolder = document.createElement('div');
        this.supernatantHolder = supernatantHolder;
        supernatantHolder.className = this.opts.className;
        supernatantHolder.style.cssText = 'display: none; opacity: .8; background: #333; width: 300px; height:50px; position: absolute; top:50%; left: 50%; margin-left: -2.5rem; margin-top: -1rem; text-align:  center; line-height: 50px;'

        this.init();

    }

    Supernatant.prototype = {
        constructor: Supernatant,
        init: function () {
            this.event();
        },
        setAttr: function (dom, objStyle) {
            for (var k in objStyle) {
                dom[k] = objStyle[k]
            }
        },
        show: function () {
            setStyle(this.supernatantHolder, {display: 'block'})
        },
        hide: function () {
            var that = this
            setTimeout(function () {
                setStyle(that.supernatantHolder, {display: 'none'})
            }, 1500)
        },
        event: function () {
            var _this = this;
            this.target.addEventListener('click', function () {
                document.body.appendChild(_this.supernatantHolder);
                _this.setAttr(_this.supernatantHolder, _this.opts);
                _this.show();
                _this.hide();
                //_this.options.close && _this.options.close();
            }, false)
        }
    }


    /*
     *   @ name 获取表单数据（form）
     *       tips: 目前支持 input(text,password,radio,checkbox,submit,hidden，select)
     *   @ FormGet(form) -> 返回的是一个FormGet的实例对象，其中的formInfo是我们所需的表单的值
     *
     *
     * */
    var FormGet = function (formId) {
        if (!(this instanceof FormGet))return new FormGet(formId);

        var formInfo;
        this.init(formId);
    };

    FormGet.prototype = {
        constructor: FormGet,
        init: function (formId) {
            this.getFormInfo(formId);
            return this.formInfo
        },
        pushElements: function (target, source) {
            for (var i = 0; i < source.length; i++) {
                target.push(source[i])
            }
        },
        //获取指定form中的所有的<input>对象
        getElements: function (formId) {
            var elements = new Array();
            var tagInputElements = formId.getElementsByTagName('input');
            var tagSelectElements = formId.getElementsByTagName('select');
            this.pushElements(elements, tagInputElements);
            this.pushElements(elements, tagSelectElements);
            return elements;
        },

        //获取单个input中的【name,value】数组
        inputSelector: function (element) {
            if (element.checked)
                return [element.name, element.value];
        },

        //获取不同类型的表单项的value
        inputCase: function (element) {
            switch (element.type.toLowerCase()) {
                case 'submit':
                case 'hidden':
                case 'password':
                case 'text':
                    return [element.name, element.value];
                case 'checkbox':
                case 'radio':
                    return this.inputSelector(element);
                case 'select-one':
                    return [element.name, element.value];
            }
        },

        //组合URL
        serializeElement: function (element) {
            var parameter = this.inputCase(element) == undefined ? '' : this.inputCase(element);
            if (parameter) {
                if (parameter[1].constructor !== Array)
                    parameter[1] = [parameter[1]];
                var values = parameter[1];
                var results = [];
                for (var i = 0; i < values.length; i++) {
                    results.push(values[i]);
                }
                return results
            }
        },

        //调用方法
        serializeForm: function (formId) {
            var elements = this.getElements(formId);
            var n = [];
            for (var k in elements) {
                n.push(elements[k])
            }
            var queryComponents = new Array();
            for (var i = 0; i < n.length; i++) {
                var queryComponent = this.serializeElement(n[i]);
                if (queryComponent)
                    queryComponents.push(queryComponent);
            }
            return queryComponents.join('&');
        },

        getFormInfo: function (formId) {
            var params = this.serializeForm(formId);
            this.formInfo = params;
        }

    };


    new PublicMain();
    window.PublicMain = PublicMain;
    window.MaskShare = MaskShare;
    window.Supernatant = Supernatant;
    window.FormGet = FormGet;
})(window);
