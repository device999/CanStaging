$('body').click(function(){
    var t = $('.tInput').val();
    var n = $('.nInput').val();
//radiobuttons T
    var infl =getRadiobutton("input[type='radio'][name='data[T[Inflammation]]']:checked");
    var exten = getRadiobutton("input[type='radio'][name='data[T[Extension]]']:checked");
    var ulcer =getRadiobutton("input[type='radio'][name='data[T[Ulceration]]']:checked");
//radiobuttons N
    var mammaryN = getRadiobutton("input[type='radio'][name='data[N[MammarymetastasesNummer]]']:checked");
    var mammary =getRadiobutton("input[type='radio'][name='data[N[Mammarymetastases]]']:checked");
    var mammaryD =getRadiobutton("input[type='radio'][name='data[N[detectedmammary]]']:checked");
    var infra =getRadiobutton("input[type='radio'][name='data[N[infraclavicularmeta]]']:checked");
    var supra =getRadiobutton("input[type='radio'][name='data[N[supraclavicularmeta]]']:checked");

//end radiobuttons
//
    if((mammaryN=="T")||(mammary=="T")||(mammaryD=="T")||(n!="")||(infra=="T")||(supra=="T"))
    {
        $.get('/breast_n',{mamN:mammaryN,mam:mammary,mamD:mammaryD,infr:infra,supr:supra,dat:n},function(data){
            document.getElementById('valueN').innerHTML=data;
            TNM();
        });
        
    }
    else
    {
        document.getElementById('valueN').innerHTML="NX";
        TNM();
    }
    if((ulcer=="T")||(infl=="T")||(exten=="T"))
    {

        document.getElementById('valueT').innerHTML =treestyle(exten,ulcer,infl);
        TNM();
    }
    else if(t!="")
    {
                $.get('/breast_ranget',{diapazon:t},function(data){
                    $.get('/breast_t',{tumour:data},function(fin){
                    document.getElementById('valueT').innerHTML=fin;
                    TNM();
                });
        });
    }
    else
    {
        document.getElementById('valueT').innerHTML="TX";
        TNM();
    }


//radioend

    var selector = document.getElementById('distantM');
    var value = selector[selector.selectedIndex].value;
    if(value!='select')
	{
    $.get('/breast_m',{met:value},function(data){
        document.getElementById('valueM').innerHTML = data;
        TNM();
    })
	}
;
});
function getRadiobutton(pathname)
{
    var result = "";
    var selected = $(pathname);
    if (selected.length > 0) {
    result = selected.val();
    }
    return result;
}

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
		  var CancerType =  'Breast';
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
	$('#distantM').prop('selectedIndex', 0);
	document.getElementById("valueM").innerHTML="MX";
	TNM();
}
function TNM()
{
    var finalT = document.getElementById('valueT').innerHTML;
    var finalN = document.getElementById('valueN').innerHTML;
    var finalM = document.getElementById('valueM').innerHTML;
    document.getElementById('TNM').innerHTML =finalT+finalN+finalM;
    
    if ((finalT!="TX")||(finalN!="NX")||(finalM!="MX"))
    {
        $.get('/breast_SG',{T:finalT,N:finalN,M:finalM},function(data){
            document.getElementById('SGRange').innerHTML = data ;
            document.getElementById('SG').innerHTML = data;
            $.get('/breast_SimpSG',{sg:data},function(result1){
                
                document.getElementById('SimpG').innerHTML = result1;                
        });
    });
    }
    
}
function probalertM(src)
{
    document.getElementById('valueM').innerHTML =(src.options[src.selectedIndex].value);
    TNM();
}
function treestyle(chest,ulcer,infl)
{
if(infl=="T")
   {
       return "T4d";
   }
   else
   {
       if(ulcer=="F")
       {
           if(chest=="T")
           {
               return "T4a";
           }
           else
           {
               return "TX"
           }
       }
       else
       {
           if(chest=="T")
           {
               return "T4c";
           }
           else
           {
               return "T4b";
           }
       }
   }
}
