
$('body').click(function(){
    //n
    var tumorSize = $('.tumorSize').val();
        var invasion = inv('invr');
    var pleura = getRadiobutton("input[type='radio'][name='data[T[visceralpleura]]']:checked");
    var atelectasis = getRadiobutton("input[type='radio'][name='data[T[Atelectasis_pneumonitis]]']:checked");
    var invades = getRadiobutton("input[type='radio'][name='data[T[tumor_invades]]']:checked");
    var tumor_nodules = getRadiobutton("input[type='radio'][name='data[T[tumor_nodules]]']:checked");
    var pneumonitis = getRadiobutton("input[type='radio'][name='data[T[pneumonitis]]']:checked");
    var vocal_cord = getRadiobutton("input[type='radio'][name='data[T[vocal_cord]]']:checked");
    var ipsilateral_lobe = getRadiobutton("input[type='radio'][name='data[T[ipsilateral_lobe]]']:checked");
    var tumor_mhg = getRadiobutton("input[type='radio'][name='data[T[tumor_mhg]]']:checked");
    if((invasion!="")||(pleura=="T")||(atelectasis=="T")||(invades=="T")||(tumor_nodules=="T")||(pneumonitis=="T")||(vocal_cord=="T")||(ipsilateral_lobe=="T")||(tumor_mhg=="T"))
    {
if(tumorSize!="")
{
        $.get('/lung_ranget',{value:tumorSize},function(data){
            $.get('/lung_t',{invas:invasion,tsize:data,pl:pleura,at:atelectasis,inv:invades,tmod:tumor_nodules,pneu:pneumonitis,vocord:vocal_cord,ipsi:ipsilateral_lobe,tmhg:tumor_mhg},function(data2){
                document.getElementById('valueT').innerHTML=data2;
                TNM();
            });
        });
}
else
{
    $.get('/lung_t2',{invas:invasion,pl:pleura,at:atelectasis,inv:invades,tmod:tumor_nodules,pneu:pneumonitis,vocord:vocal_cord,ipsi:ipsilateral_lobe,tmhg:tumor_mhg},function(data2){
        document.getElementById('valueT').innerHTML=data2;
        TNM();
    });
}
    }
    else
    {
        document.getElementById('valueT').innerHTML="TX";
        TNM();
    }
});

function TNM()
{
    var finalT = document.getElementById('valueT').innerHTML;
    var finalN = document.getElementById('valueN').innerHTML;
    var finalM = document.getElementById('valueM').innerHTML;
    document.getElementById('TNM').innerHTML =finalT+finalN+finalM;
    
    if ((finalT!="TX")||(finalN!="NX")||(finalM!="MX"))
    {

        $.get('/lung_SG',{T:finalT,N:finalN,M:finalM},function(data){
            document.getElementById('SGRange').innerHTML = data ;
            document.getElementById('SG').innerHTML = data;
            $.get('/lung_SimpSG',{sg:data},function(result1){
                document.getElementById('SimpG').innerHTML = result1;
           
        });
    });
    }
    
}
function resetDistantT()
{
	$('#invr').prop('selectedIndex', 0);
	document.getElementById("valueT").innerHTML="TX";
	TNM();
}
function resetDistantN()
{
	$('#lymph').prop('selectedIndex', 0);
	document.getElementById("valueN").innerHTML="NX";
	TNM();
}
function resetDistantM()
{
	$('#metastas').prop('selectedIndex', 0);
	document.getElementById("valueM").innerHTML="MX";
	TNM();
}
function probalertN(src)
{
    document.getElementById('valueN').innerHTML =(src.options[src.selectedIndex].value);
    TNM();
}

function probalertM(src)
{
    document.getElementById('valueM').innerHTML =(src.options[src.selectedIndex].value);
    TNM();
}

function getRadiobutton(pathname)
{
    var result = "";
    var selected = $(pathname);
    if (selected.length > 0) {
    result = selected.val();
    }
    return result;
}
function inv(pathname)
{
    var sel = document.getElementById(pathname); // Получаем наш список
    var val = sel.options[sel.selectedIndex].value;
    return val;
}
function assignT(nodT4,invT4,vocal,bronchus,nodT3,atelectasis,invT3)
{
    if((nodT4=="T")||(invT4=="T")||(vocal=="T")||(vocal=="4"))
    {
        return "T4;"
    }
    else if((nodT3=="T")||(invT3=="T")||(atelectasis=="T"))
    {
        return "T3";
    }
    else
    {
        return "More";
    }
}
function ResetForm()
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
		  var CancerType =  'Lung';
		  var utc = new Date().toJSON().slice(0,10);
		  var SGRange = document.getElementById("SGRange").innerHTML;
		  var SimpG = document.getElementById("SimpG").innerHTML;
		  var SG = document.getElementById("SG").innerHTML;
		$.get('/submit_breast',{t:T,n:N,m:M,tnm:TNM,cType:CancerType,time:utc,sgr:SGRange,sim:SimpG,sg:SG},function(data){
        alert(data);
    })
}