var arr = [];
for(var i = 1; i <= 10; i++){
    arr.push({ Index: i });        
}
$('#TestTemplate').tmpl(arr).appendTo('#dvTemplate');
