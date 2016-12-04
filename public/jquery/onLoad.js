window.onload = function(){
		var counter = 1;
		onL(counter);
}
function onL(counter)
{
	$.get('/onLoad',{count:counter},function(data){
        if(data[0]!='1')
		{
		$('#inf').append('<tbody><tr id="added"><td>'+data[1]+'</td><td>'+data[2]+'</td><td>'+data[3]+'</td><td>'+data[4]+'</td><td>'+data[5]+'</td><td>'+data[6]+'</td><td>'+data[7]+'</td><td>'+data[8]+'</td><td>'+data[9]+'</td><td>'+data[10]+'</td><td>'+data[11]+'</td><td>'+data[12]+'</td><td>'+data[13]+'</td></tr></tbody>');
		onL(counter + 1);
		}
		});
}
function clearLog()
{
$.get('/clearLog',function(data){
	alert(data);
});
location.reload();
}

function download()
{
$.get('/downloadLog',function(data){
//document.location.replace(data);
$('body').append('<br/><a href="'+data+'">Download your file</a>');
});

}