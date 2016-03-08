var WaterFall = {
    $: function(id){return document.getElementById(id);},
    
    createChild: function(imgUrl, title) {
        var str = "<img src=" + imgUrl + "></img><p class='title'>" + title + "</p>";
        var div = document.createElement("div");
        div.className = "water";
        div.innerHTML = str; 
        return div;
    },
    
    insertChild: function() {
        var sortedColumns = this.sortColumuByHeight();
        
        for(var i = 0; i < demoData.length; i++){
            var child = this.createChild(demoData[i].imgUrl, demoData[i].title);
            
            // 根据列数求得到列标
            var idx = ((i+1)>4) ? i%4 : i;            
			// 在列上添加数据
			sortedColumns[idx].appendChild(child);
        }
        
    },
    
    sortColumuByHeight: function() {
        var columns = [this.$("column1"), this.$("column2"), this.$("column3"), this.$("column4")];
        var heights = [];
        
        for(var i = 0; i < columns.length; i++) {
            columns[i].height = columns[i].offsetHeight;
            heights.push(columns[i]);
        }
        
        heights.sort(function(a, b) {
            return a.height - b.height;
        });
        
        return heights;
    },
    
    onScroll: function(){
        // 获取高度等数据
        var height = PageUtil.getPageHeight();
        var scrollTop = PageUtil.getScrollTop();
        var clientHeight = PageUtil.getClientHeigth();
        
        // 如果滚动到最底部，就加载
        if(scrollTop + clientHeight > height - 50){
            WaterFall.insertChild();
        }
    },
    
    timer: null
};


EventUtil.addHandler(window, "scroll", function(){
    clearTimeout(WaterFall.timer);
    WaterFall.timer = setTimeout(WaterFall.onScroll, 500);
});