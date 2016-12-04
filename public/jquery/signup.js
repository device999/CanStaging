function add()
{
	var log=$('.user').val();
	var pass= $('.pass').val();
	$.get('/reg',{password:pass,login:log},function(data){
		document.location.replace(data);
	});
}
