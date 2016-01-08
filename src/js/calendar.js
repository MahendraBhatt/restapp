(function(){
    var calendar = {
        id: parseInt(Math.random() * 1000, 10),
        levels: { decade: 1, year:2, month: 3 },
        currentLevel: 3,
        modes: { previous: 'previous', upper: 'upper', next: 'next' },
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
        days: ['Su','Mo','Tu','We','Th','Fr','Sa'],
        container: document.createElement('div'),
        wrapper: document.createElement('div'),
        subContainer: document.createElement('div'),
        setDate: function(){
            var d = new Date($(this).attr('data'));
            console.log(d.mmddyyyy());
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
                    if(year + 10 <= 2099 && year - 10 >= 1900){
                        year = (mode == calendar.modes.previous) ? year - 10 : year + 10;
                    }
                } else if(calendar.currentLevel == calendar.levels.year){
                    if(year < 2099 && year > 1900){
                        year = (mode == calendar.modes.previous) ? year - 1 : year + 1;
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
            leftArrow.className = 'leftarrow';
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
            rightArrow.className = 'rightarrow';
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
            $('#leftarrow_'+calendar.id).off('click').on('click',function(e){
                calendar.load(calendar.modes.previous, year, month);
                e.preventDefault();
            });
            $('#rightarrow_'+calendar.id).off('click').on('click',function(){
                calendar.load(calendar.modes.next, year, month);
            });
            var monthyear = $('#monthyear_'+calendar.id);
            monthyear.off('click').on('click',function(){
                calendar.load(calendar.modes.upper, year, month);
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
        renderWeek: function(frag, day, firstDay, lastDay){
            var ul = document.createElement('ul');
            ul.className = 'dates';
            for(var d = 0; d <= 6; d++){ 
                day.setDate(day.getDate() + 1);
                var li = document.createElement('li');
                if(day < firstDay || day > lastDay){
                    li.className = 'dateNotOfCurrentMonth';
                }
                li.setAttribute('data', day.toString());
                li.onclick = calendar.setDate;
                li.innerHTML = day.getDate().toString();
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
            for (var i = firstDayOfWeek; i <= lastDay; i.setDate(i.getDate() + 7)) {
                calendar.renderWeek(frag, day, firstDay, lastDay);
                rows++;
            }
            //Ensuring always 6 rows are rendered in calendar for consistency
            if(rows === 5){
                calendar.renderWeek(frag, day, firstDay, lastDay);
            }
            $(calendar.subContainer).append(frag);
        },
        render: function(year, month, mode){
            if(mode !== undefined){
                var oldSubContainer = calendar.subContainer;
                var newSubContainer = document.createElement('div');
                newSubContainer.className = 'floater';
                calendar.subContainer = newSubContainer;
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
                    // var sub = $(calendar.subContainer);
                    // var timer = setInterval(function(){
                    //     var val = sub.css('transform');
                    //     val = val.replace('matrix(','')
                    //     val = parseFloat(val.substring(0, val.indexOf(',')));
                    //     if(val > 0.1){
                    //         $(sub).css({
                    //             'transform': 'scale(' + (val - 0.1) + ')'
                    //         });
                    //     } else {
                    //         clearInterval(timer);                              
                    //     }
                    // }, 10);
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
                //renderMonths
            } else if(calendar.currentLevel === calendar.levels.decade){
                //renderYears
            }
        },
        build: function(date){
            var y = date.getFullYear(), m = date.getMonth();
            $(calendar.container).addClass('calendar');
            calendar.renderMonthYear(y, m);
            calendar.wrapper.className = 'wrapper';
            $(calendar.container).append(calendar.wrapper);
            calendar.render(y, m);
            document.body.appendChild(calendar.container);
        }   
    };

    calendar.build(new Date());
})();