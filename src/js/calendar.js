//(function(){
    var calendar = {
        input: null,
        minYear: 1900,
        maxYear: 2099,
        id: parseInt(Math.random() * 1000, 10),
        levels: { decade: 1, year:2, month: 3 },
        currentLevel: 3,
        today: null,
        modes: { previous: 'previous', upper: 'upper', next: 'next' },
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
        days: ['Su','Mo','Tu','We','Th','Fr','Sa'],
        container: document.createElement('div'),
        wrapper: document.createElement('div'),
        subContainer: document.createElement('div'),
        setDate: function(){
            var d = new Date($(this).attr('data'));
            calendar.input.val(d.mmddyyyy());
            calendar.hide();
        },
        load: function(mode, year, month){
            if(mode === calendar.modes.upper){
                if(calendar.currentLevel == calendar.levels.month){
                   calendar.currentLevel = calendar.levels.year;
                } else if(calendar.currentLevel == calendar.levels.year){
                   calendar.currentLevel = calendar.levels.decade;
                }
            } else {
                if(calendar.currentLevel == calendar.levels.decade){
                    if(mode === calendar.modes.previous && year - 10 >= calendar.minYear){
                        year = year - 10;
                    }else if(mode === calendar.modes.next && year + 10 <= calendar.maxYear){
                        year = year + 10;
                    }
                } else if(calendar.currentLevel == calendar.levels.year){
                    if(mode === calendar.modes.previous && year > calendar.minYear){
                        year = year - 1;
                    }else if(mode === calendar.modes.next && year < calendar.maxYear){
                        year = year + 1;
                    }
                } else if(calendar.currentLevel == calendar.levels.month){
                   month = (mode == calendar.modes.previous) ? month - 1 : month + 1;
                }
            }
            var d = new Date(year, month, 1);
            calendar.changeMonthYearEvent(d.getFullYear(), d.getMonth());
            calendar.render(d.getFullYear(), d.getMonth(), mode);
        },
        renderMonthYear: function(year, month){
            var frag = document.createDocumentFragment();
            var leftArrow = document.createElement('a');
            leftArrow.className = 'leftarrow leftarrow-image';
            leftArrow.innerHTML = '&nbsp;';
            leftArrow.id = 'leftarrow_'+calendar.id;
            $(leftArrow).on('click',function(e){ calendar.load(calendar.modes.previous, year, month); e.preventDefault(); });
            frag.appendChild(leftArrow);
            var monthYear = document.createElement('a');
            monthYear.id = 'monthyear_'+calendar.id;
            monthYear.innerHTML = calendar.months[month]+ ', '+year;
            $(monthYear).on('click',function(){ calendar.load(calendar.modes.upper, year, month); });
            frag.appendChild(monthYear);
            var rightArrow = document.createElement('a');
            rightArrow.className = 'rightarrow rightarrow-image';
            rightArrow.id = 'rightarrow_'+calendar.id;
            rightArrow.innerHTML = '&nbsp;';
            $(rightArrow).on('click',function(){ calendar.load(calendar.modes.next, year, month); });
            frag.appendChild(rightArrow);
            $(leftArrow).dblclick(function(e){ e.preventDefault(); });
            $(rightArrow).dblclick(function(e){ e.preventDefault(); });
            $(monthYear).dblclick(function(e){ e.preventDefault(); });
            $(calendar.container).append(frag);
        },
        changeMonthYearEvent: function(year, month){
            var leftArrow = $('#leftarrow_'+calendar.id);
            var rightArrow = $('#rightarrow_'+calendar.id); 
            leftArrow.off('click');
            rightArrow.off('click');
            var assignLeftEvent = true, assignRightEvent = true;

            if(calendar.currentLevel === calendar.levels.month){
                assignLeftEvent = !(year == calendar.minYear && month == 0);
                assignRightEvent = !(year == calendar.maxYear && month == 11);
            } else if(calendar.currentLevel === calendar.levels.year){
                assignLeftEvent = year !== calendar.minYear;
                assignRightEvent = year !== calendar.maxYear;
            } else if(calendar.currentLevel === calendar.levels.decade){
                assignLeftEvent = year - 10 >= calendar.minYear;  
                assignRightEvent =  year + 10 <= calendar.maxYear;
            } 
            
            if(assignLeftEvent === true){
                leftArrow.addClass('leftarrow-image');
                leftArrow.on('click',function(e){
                    calendar.load(calendar.modes.previous, year, month);
                });
            } else {
                leftArrow.removeClass('leftarrow-image');
            }
            
            if(assignRightEvent === true){
                rightArrow.addClass('rightarrow-image');
                rightArrow.on('click',function(e){
                    calendar.load(calendar.modes.next, year, month);
                });
            } else {
                rightArrow.removeClass('rightarrow-image');
            }
                        
            var monthyear = $('#monthyear_'+calendar.id);
            monthyear.off('click').on('click',function(e){
                if(calendar.currentLevel !== calendar.levels.decade){
                    calendar.load(calendar.modes.upper, year, month);
                }
            });
            if(calendar.currentLevel === calendar.levels.decade){
                var decadeStartYear = year;
                while (decadeStartYear % 10 !== 0) {
                   decadeStartYear--;
                }
                monthyear.html(decadeStartYear + ' - ' + (decadeStartYear + 9));                    
            } else if(calendar.currentLevel === calendar.levels.year){
                monthyear.html(year);
            } else if(calendar.currentLevel === calendar.levels.month){
                monthyear.html(calendar.months[month]+ ', '+year);
            }
        },
        renderYears: function(year, month){
            var decadeStartYear = year, decadeEndYear = 0;
            while (decadeStartYear % 10 !== 0) {
                decadeStartYear--;
            }
            var actualDecadeStartYear = decadeStartYear, actualDecadeEndYear = decadeStartYear + 9;
            decadeStartYear = decadeStartYear - 1;
            decadeEndYear = decadeStartYear + 3;
            for(var d = 0; d <= 2; d++){
                var ul = document.createElement('ul');
                ul.className = 'months';
                for(var i = decadeStartYear; i <= decadeEndYear; i++){ 
                    var li = document.createElement('li');
                    if(i >= calendar.minYear && i <= calendar.maxYear){
                        li.setAttribute('data-month', month);
                        li.setAttribute('data-year', i);
                        if(i < actualDecadeStartYear || i > actualDecadeEndYear){
                            li.className = 'dateNotOfCurrentMonth';
                        }
                        li.innerHTML = i;
                        li.onclick = function(){ 
                            var y = parseInt($(this).attr('data-year'), 10);
                            var m = parseInt($(this).attr('data-month'), 10);
                            $(calendar.subContainer).html('');
                            calendar.currentLevel = calendar.levels.year;
                            calendar.changeMonthYearEvent(y, m);
                            calendar.renderMonths(y, m);
                        };
                    }
                    ul.appendChild(li);
                }
                $(calendar.subContainer).append(ul);
                if(decadeEndYear + 4 < decadeStartYear + 11){
                    decadeStartYear = decadeStartYear + 4;
                    decadeEndYear = decadeEndYear + 4;
                }
            }
        },
        renderMonths: function(year, month){
            var startMonth = 0, endMonth = 3;
            for(var d = 0; d <= 2; d++){
                var ul = document.createElement('ul');
                ul.className = 'months';
                for(var i = startMonth; i <= endMonth; i++){ 
                    var li = document.createElement('li');
                    li.setAttribute('data-month', i);
                    li.setAttribute('data-year', year);
                    li.onclick = function(){
                        var y = parseInt($(this).attr('data-year'), 10);
                        var m = parseInt($(this).attr('data-month'), 10); 
                        calendar.renderMonth(y, m);
                    };
                    li.innerHTML = calendar.months[i].substr(0, 3);
                    ul.appendChild(li);
                }
                $(calendar.subContainer).append(ul);
                if(endMonth + 4 < calendar.months.length){
                    startMonth = startMonth + 4;
                    endMonth = endMonth + 4;
                }
            }
        },
        renderMonth: function(y, m){
            $(calendar.wrapper).html('');
            calendar.currentLevel = calendar.levels.month;
            calendar.changeMonthYearEvent(y, m);
            calendar.render(y, m);
        },
        renderWeek: function(frag, day, firstDay, lastDay){
            var ul = document.createElement('ul');
            ul.className = 'dates';
            for(var d = 0; d <= 6; d++){ 
                day.setDate(day.getDate() + 1);
                var li = document.createElement('li');
                if(day < firstDay || day > lastDay){
                    li.className = 'dateNotOfCurrentMonth';
                } else if(day.mmddyyyy() === calendar.today) {
                    li.className = 'today';
                }
                li.innerHTML = day.getDate().toString();
                li.setAttribute('data', day.toString());
                li.onclick = calendar.setDate;
                ul.appendChild(li);
            }
            frag.appendChild(ul);
        },
        renderDaysOfWeek: function(){
            var str = '<div class="separator"></div>';
            str += '<ul class="days">';
            calendar.days.forEach(function(element) {
                str += '<li>'+element+'</li>';
            });
            str += '</ul>';
            $(calendar.subContainer).append(str);  
        },
        renderDays: function(y, m){
            var firstDayOfWeek = new Date(y, m, 1);
            firstDayOfWeek.setDate(- firstDayOfWeek.getDay());
            var day = new Date(y, m, 1);
            day.setDate(- day.getDay());
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);
            var frag = document.createDocumentFragment();
            var rows = 0;
            for (var i = firstDayOfWeek; i < lastDay; i.setDate(i.getDate() + 7)) {
                calendar.renderWeek(frag, day, firstDay, lastDay);
                rows++;
            }
            var isLastYearLastMonth = !(y == calendar.maxYear && m == 11);
            //Ensuring always 6 rows are rendered in calendar for consistency
            if((rows === 5 && isLastYearLastMonth === true) || rows === 4){
                calendar.renderWeek(frag, day, firstDay, lastDay);
            } 
            $(calendar.subContainer).append(frag);
        },
        render: function(year, month, mode){
            if(mode !== undefined){
                if(mode !== calendar.modes.upper){
                    var oldSubContainer = calendar.subContainer;
                    var newSubContainer = document.createElement('div');
                    newSubContainer.className = 'floater';
                    calendar.subContainer = newSubContainer;
                }
                if(mode === calendar.modes.previous){
                    $(oldSubContainer).before(newSubContainer);
                    $(calendar.wrapper).css('left', '-175px');
                    $(calendar.wrapper).animate({'left': '0' }, function(){
                        $(oldSubContainer).remove();    
                    });
                } else if(mode === calendar.modes.next){
                    $(oldSubContainer).after(newSubContainer);
                    $(calendar.wrapper).animate({'left': '-=175px' }, function(){
                        $(calendar.wrapper).css('left', 0);
                        $(oldSubContainer).remove();    
                    });
                } else if(mode === calendar.modes.upper){
                    $(calendar.subContainer).html('');
                }
            } else{
                calendar.subContainer.className = 'floater';
                $(calendar.subContainer).html('');
                $(calendar.wrapper).append(calendar.subContainer);    
            }
            
            if(calendar.currentLevel === calendar.levels.month){
                calendar.renderDaysOfWeek();
                calendar.renderDays(year, month);
            } else if(calendar.currentLevel === calendar.levels.year){
                calendar.renderMonths(year, month);
            } else if(calendar.currentLevel === calendar.levels.decade){
                calendar.renderYears(year, month);
            }
        },
        build: function(date){
            var y = date.getFullYear(), m = date.getMonth();
            calendar.today = date.mmddyyyy();
            $(calendar.container).addClass('calendar-control');
            calendar.renderMonthYear(y, m);
            calendar.wrapper.className = 'wrapper';
            $(calendar.container).append(calendar.wrapper);
            calendar.render(y, m);
            document.body.appendChild(calendar.container);
            $(calendar.container).click(function(e){
                e.stopPropagation();
            });
        },
        show: function(){
            var offset = calendar.input.offset();
            $(calendar.container).css({ top: parseFloat(calendar.input.outerHeight() + offset.top) +'px', left: offset.left+'px' });
            $(calendar.container).show();
        }, 
        hide: function(){
            $(calendar.container).hide();
            //var d = new Date();
            //calendar.renderMonth(d.getFullYear(), d.getMonth());
        }
    };

    calendar.build(new Date());
    
    $(document).click(function(e){
        calendar.hide();
    });
    
    app.attachCalendarEvent();
//})();