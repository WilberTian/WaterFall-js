var EventUtil= {
   addHandler: function(element, type, handler) { //添加事件
      if(element.addEventListener) { 
         element.addEventListener(type, handler, false);   
      }else if(element.attachEvent) {                     
         element.attachEvent("on"+type, handler);
      }else{
         element["on" + type]=handler;           
      }
   },  

   removeHandler: function(element, type, handler) {  //取消事件
      if(element.removeEventListener) {
         element.removeEventListener(type, handler, false);
      }else if(element.detachEvent) {
         element.detachEvent("on"+type, handler);
      }else{
         element["on"+type]=null;
      }
   }
};   

var PageUtil = {
    getPageHeight: function () {
        //获取页面总高度（总高度 = 卷去高度 + 可视区域高度）
        return document.documentElement.scrollHeight || document.body.scrollHeight;
    },
    
    getScrollTop: function () {
        // 获取页面卷去的高度
        return document.documentElement.scrollTop || document.body.scrollTop;
    },
    
    getClientHeigth: function () {
        // 获取页面可视区域宽度
        return document.documentElement.clientHeight || document.body.clientHeight;
    },
};