$('body').click(function(){
    var n = $('.nInput').val();
//radiobuttons T
    var tumour = "";
    var selected = $("input[type='radio'][name='data[N[tumourdeposit]]']:checked");
    if (selected.length > 0) {
    tumour = selected.val();
    }
//end radiobuttons
//
    if((n!=""))
    {
        $.get('/colorectal_n',{tum:tumour,node:n},function(data){
            document.getElementById('valueN').innerHTML=data;
            TNM();
        });
        
    }
//radioend
});
function resetForm()
{
          document.getElementById("table_form").reset();
          document.getElementById("valueT").innerHTML="TX";
          document.getElementById("valueN").innerHTML="NX";
          document.getElementById("valueM").innerHTML="M0";
          document.getElementById("TNM").innerHTML="";  
          document.getElementById("SGRange").innerHTML="";
          document.getElementById("SimpG").innerHTML="";
          document.getElementById("SG").innerHTML="";
}
function submitForm()
{
		  var T  = document.getElementById("valueT").innerHTML;
		  var N = document.getElementById("valueN").innerHTML;
		  var M = document.getElementById("valueM").innerHTML;
		  var TNM = document.getElementById("TNM").innerHTML;
		  var CancerType =  'Colorectal';
		  var utc = new Date().toJSON().slice(0,10);
		  var SGRange = document.getElementById("SGRange").innerHTML;
		  var SimpG = document.getElementById("SimpG").innerHTML;
		  var SG = document.getElementById("SG").innerHTML;
		$.get('/submit_breast',{t:T,n:N,m:M,tnm:TNM,cType:CancerType,time:utc,sgr:SGRange,sim:SimpG,sg:SG},function(data){
        alert(data);
    })
}

function resetDistantM()
{
    $('#distantM').prop('selectedIndex', -1);
    document.getElementById("valueM").innerHTML="M0";
    TNM();
}
function resetDistantT()
{
    $('#distantT').prop('selectedIndex', -1);
    document.getElementById("valueT").innerHTML="TX";
    TNM();
}
function TNM()
{
    var finalT = document.getElementById('valueT').innerHTML;
    var finalN = document.getElementById('valueN').innerHTML;
    var finalM = document.getElementById('valueM').innerHTML;
    document.getElementById('TNM').innerHTML =finalT+finalN+finalM;
    
    if ((finalT!="TX")||(finalN!="NX")||(finalM!="M0"))
    {

        $.get('/colorectal_SG',{T:finalT,N:finalN,M:finalM},function(data,dukes1){
            document.getElementById('SGRange').innerHTML = data ;
            document.getElementById('SG').innerHTML = data;
            $.get('/colorectal_SimpSG',{sg:data},function(result1){
                document.getElementById('SimpG').innerHTML = result1;
           
        });
    });
    }
    else
    {
            document.getElementById('SGRange').innerHTML = "" ;
            document.getElementById('SG').innerHTML = "";
            document.getElementById('SimpG').innerHTML = "";
    }
    
}

function probalertT(src)
{
    document.getElementById('valueT').innerHTML =(src.options[src.selectedIndex].value);
    TNM();
}

function probalertM(src)
{
    document.getElementById('valueM').innerHTML =(src.options[src.selectedIndex].value);
    TNM();
}