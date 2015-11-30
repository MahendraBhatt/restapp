var gridPager = function (options) {
	return (new function () {
		var maxPagesToShow = 10, pageSize = 10,	currentPageNo = 1, previousPageNo = 0, recordSkip = 0, recordEnd = currentPageNo * pageSize,
			count = options.count,
			maxPages = Math.ceil(count / pageSize),
			element = $(options.element),
			showPreviousNext = (options.showPreviousNext === undefined) ? true : options.showPreviousNext,
			pageType = { previous : 1, page: 2, next: 3 },
			uid = getRandomString(5),
			target = options.target;  
		
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
			currentPageNo = currentPageNo > 1 ? currentPageNo - 1 : 1;
			getRecordStartNEnd();
		}
		
		function gotoPage(){
			currentPageNo = parseInt(this.innerHTML, 10);
			getRecordStartNEnd();
		}
		
		function gotoNextPage(){
			currentPageNo = currentPageNo < maxPages ? currentPageNo + 1 : currentPageNo;
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
		
		this.build = function () {
			element.html('');
			var pages = Math.ceil(count / pageSize);
			pages = maxPagesToShow > pages ? pages : maxPagesToShow;
			var pager = document.createElement('ul');
			if(showPreviousNext){
				addListNodeTo(pager, '<', pageType.previous);
			}
			for (var i = 1; i <= pages; i++) {
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