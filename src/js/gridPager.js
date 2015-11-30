var gridPager = function (options) {
	return (new function () {
		var that = this;
		var maxPagesToShow = 10, pageSize = 10,	currentPageNo = 1, previousPageNo = 0, recordSkip = 0, recordEnd = currentPageNo * pageSize,
			count = options.count,
			maxPages = Math.ceil(count / pageSize),
			element = $(options.element),
			showPreviousNext = (options.showPreviousNext === undefined) ? true : options.showPreviousNext,
			pageType = { previous : 1, page: 2, next: 3 },
			uid = getRandomString(5),
			target = options.target;  
		
		function isFirstInSeries(pageno){
			return $('#'+uid+'_'+pageno).prev('li').attr('id') === uid+'_<';
		}
		
		function isLastInSeries(pageno){
			return $('#'+uid+'_'+pageno).next('li').attr('id') === uid+'_>';
		}
		
		function highlightPageNo(){
			$('#'+uid + '_' + previousPageNo).removeClass('current');
			$('#'+uid + '_' + currentPageNo).addClass('current');
			previousPageNo = currentPageNo;
			target.call(null, { skip: recordSkip, limit: pageSize });
			//console.log(currentPageNo + ' ' + recordSkip + ' ' + pageSize);
		} 
		
		function getRecordStartNEnd(){
			recordEnd = currentPageNo * pageSize;
			recordSkip = recordEnd - pageSize;
			highlightPageNo();
		} 
		
		function gotoPreviousPage(){
			if(currentPageNo === 1) { return false; }
			currentPageNo = currentPageNo > 1 ? currentPageNo - 1 : 1;
			if(currentPageNo + 1 > maxPagesToShow){
				if(isFirstInSeries(currentPageNo + 1)){
					that.build(currentPageNo - maxPagesToShow, currentPageNo);
				}
			}
			getRecordStartNEnd();
		}
		
		function gotoPage(){
			currentPageNo = parseInt(this.innerHTML, 10);
			if(currentPageNo === previousPageNo) { return false; }
			getRecordStartNEnd();
		}
		
		function gotoNextPage(){
			if(currentPageNo === maxPages) { return false; }
			currentPageNo = currentPageNo < maxPages ? currentPageNo + 1 : currentPageNo;
			if(currentPageNo > maxPagesToShow){
				if(isLastInSeries(currentPageNo - 1)){
					var endPage = Math.ceil(count / pageSize);
					endPage = currentPageNo + maxPagesToShow - 1 > endPage ? endPage : currentPageNo + maxPagesToShow - 1;
					that.build(currentPageNo, endPage);
				}
			}
			getRecordStartNEnd();
		}
		
		function bindPageEvent(node, type){
			if(type === pageType.previous){
				node.onclick = gotoPreviousPage;
			}else if(type === pageType.page){
				node.onclick = gotoPage;
			}else if(type === pageType.next){
				node.onclick = gotoNextPage;
			}
		}
		
		function addListNodeTo(pager, html, type){
			var li = document.createElement('li');
			li.innerHTML = html;
			li.id = uid + '_' + html;
			pager.appendChild(li);
			bindPageEvent(li, type);
		}
		
		this.build = function (startPage, endPage) {
			element.html('');
			var pages = endPage;
			startPage = startPage || 1;
			if(pages === undefined){
				pages = Math.ceil(count / pageSize);
				pages = maxPagesToShow > pages ? pages : maxPagesToShow;
			}
			var pager = document.createElement('ul');
			if(showPreviousNext){
				addListNodeTo(pager, '<', pageType.previous);
			}
			for (var i = startPage; i <= pages; i++) {
				addListNodeTo(pager, i, pageType.page);
			}
			if(showPreviousNext){
				addListNodeTo(pager, '>', pageType.next);
			}
			element.append(pager);
			highlightPageNo();
		};
	})
};