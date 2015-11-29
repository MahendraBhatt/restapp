var gridPager = function (options) {
	return (new function () {
		var maxpages = 10,	pagesize = 10,	crMinPageNo = 0, crMaxPageNo = 0, count = options.count; 
				
		this.build = function () {
			// 	var curmax = (count >= crmax) ? crmax : count;
			// 	var pages = Math.ceil((curmax - crmin + 1) / pagesize);
			// 	if (crmin > max) {
			// 		var anc = document.createElement('A');
			// 		anc.href = "#this";
			// 		anc.onclick = function () { crmin = crmin - max; crmax = crmax - max; buildPager(); bringResult(); }
			// 		anc.innerHTML = "...";
			// 		pager.appendChild(anc);
			// 	}
			// 	var startpage = Math.ceil(crmin * pagesize / max);
			// 	for (var i = 1; i <= pages; i++) {
			// 		var anc = document.createElement('A');
			// 		anc.href = "#this";
			// 		anc.pageno = i;
			// 		anc.className = "page";
			// 		anc.onclick = function () { gotoPage(this); }
			// 		anc.innerHTML = startpage + (i - 1);
			// 		pager.appendChild(anc);
			// 	}
			// 	if (count > crmax) {
			// 		var anc = document.createElement('A');
			// 		anc.href = "#this";
			// 		anc.onclick = function () { crmin = crmin + max; crmax = crmax + max; buildPager(); bringResult(); }
			// 		anc.innerHTML = "...";
			// 		pager.appendChild(anc);
			// 	}
			var pages = Math.ceil(count / pagesize);
			pages = maxpages > pages ? pages : maxpages;
			for (var i = 1; i < pages; i++) {
				console.log(i);
			}
		};
	})
};
			
			