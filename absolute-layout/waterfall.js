var WaterFall = function (options) {
    var id = options.id,
          picWidth = options.picWidth || 190,
          columnPadding = options.columnPadding || 10,
          columnBorder = options.columnBorder || 1,
          columnMarginRight = options.columnMarginRight || 20,
          columnMarginBottom = options.columnMarginBottom || 20,
          // 格子总宽度
          cellClientWidth = picWidth + columnPadding * 2 + columnBorder * 2,
          wrapper = document.getElementById(id),
          // 用于记录当前插入的格子数量
          sortedCells = 0,
          // 记录所有的列高度
          columnHeigths = [],
          // 用于记录每个单独层对象
          cells = []; 

    // 获取列数
    function getColumnNum() {
        // 根据每列的宽度来计算总共的列数
        var bodyElement = document.getElementsByTagName("body")[0];
        var columnNum = Math.floor(bodyElement.clientWidth / (cellClientWidth + columnMarginRight));
        // 然后再设置wrapper的宽度，是其保持居中
        wrapper.style.width = columnNum * (cellClientWidth + columnMarginRight) - columnMarginRight + "px";
        
        return columnNum;
    }

    // 创建格子
    function createCell(left, top, imgUrl, imgHeight, title) {
        var inHTML = "<img src=" + imgUrl + " alt=" + title + "><p class='title'>" + title + "</p></a>";
        var div = document.createElement("div");
        
        div.className = "cell";
        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px";
        div.innerHTML = inHTML;
        return div;
    }

    // 插入数据
    function insert(data) {
        var fragElement = document.createDocumentFragment();
        if (data.length > 0) {
            for (var i = 0, n = data.length; i < n; i++) {
                var cell = createCell(-9999, -9999, data[i].imgUrl, data[i].height, data[i].title);
                fragElement.appendChild(cell);
                cells.push(cell);
            }
            wrapper.appendChild(fragElement);
        }
    }

    //排序
    function sort(){
        var columnNum = getColumnNum(), 
              left, 
              minColumnIdx;
        //sortedCells的作用是不让已经加载的数据重新计算定位排列
        for (var j = sortedCells, k = cells.length; j < k; j++, sortedCells++) {
            if (j < columnNum) {
                // 第一列top值为0
                cells[j].style.top = "0px";
                // 计算Cell的left值
                left = j * (cellClientWidth + columnMarginRight);
                cells[j].style.left = left + "px";
                // 设置Column高度
                columnHeigths[j] = cells[j].offsetHeight + columnMarginBottom;
            } else {
                // 找到高度最小的Column
                minColumnIdx = columnHeigths.indexOf(Math.min.apply(Math, columnHeigths));
                // Cell的top值为当前Column高度
                cells[j].style.top = columnHeigths[minColumnIdx] + "px";
                // 计算Cell的left值
                left = minColumnIdx * (cellClientWidth + columnMarginRight);
                cells[j].style.left = left + "px";
                // 设置Column高度
                columnHeigths[minColumnIdx] += cells[j].offsetHeight + columnMarginBottom;
            }
        }
    }

    // resize 重新排列
    function resort() {
        // 设置sortedCells=0即可重排
        sortedCells = 0;
        // 重排
        sort();
    }
    // 暴露接口
    return {
        insert:insert,
        sort: sort,
        resort:resort
    }

};

var timers = {
    scrollTimer: null,
    resizeTimer: null
};

var WaterFallInstance = WaterFall({id: "warp"});
WaterFallInstance.insert(demoData);
window.onload = function() {
    // 在图片加载之后进行sort，因为需要获取图片高度
    WaterFallInstance.sort();
};

EventUtil.addHandler(window, "scroll", function () {
    clearTimeout(timers.scrollTimer); 
    timers.scrollTimer = setTimeout(function () {
        var height = PageUtil.getPageHeight();
        var scrollTop = PageUtil.getScrollTop();
        var clientHeight = PageUtil.getClientHeigth();
        
        // 如果滚动到最底部，就加载
        if (scrollTop + clientHeight > height - 50) {
            WaterFallInstance.insert(demoData);
            WaterFallInstance.sort();
        }
    }, 500);
});

EventUtil.addHandler(window, "resize", function () {
    clearTimeout(timers.resizeTimer);
    timers.resizeTimer = setTimeout(function () {
        WaterFallInstance.resort();
    }, 500)
})