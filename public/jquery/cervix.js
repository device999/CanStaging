
$('body').click(function(){
//----------------------------------------------------

//t
    var invasion = selectF('invasion');
    var lesion = selectF('lesion');
    //RadioButtons
    var MicroLesion = getRadiobutton("input[type='radio'][name='data[T[MicroLesion]]']:checked");
    var uterus = getRadiobutton("input[type='radio'][name='data[T[uterus]]']:checked");
    var involvement = getRadiobutton("input[type='radio'][name='data[T[involvement]]']:checked");
    var carcinoma = getRadiobutton("input[type='radio'][name='data[T[carcinoma]]']:checked");
    var pelvicwall = getRadiobutton("input[type='radio'][name='data[T[pelvicwall]]']:checked");
    var kidney = getRadiobutton("input[type='radio'][name='data[T[kidney]]']:checked");
    var BladderRectum = getRadiobutton("input[type='radio'][name='data[T[BladderRectum]]']:checked");
    if((invasion!="")||(lesion!="")||(MicroLesion=="T")||(uterus=='T')||(involvement=="T")||(carcinoma=="T")||(kidney=="T")||(pelvicwall=="T")||(BladderRectum=="T"))
    {
        $.get('/cervix_t',{but:uterus,micro:MicroLesion,strom:invasion,exvis:lesion,param:involvement,vag:carcinoma,pel:pelvicwall,hydro:kidney,mucosa:BladderRectum},function(data){
                    document.getElementById('valueT').innerHTML = data;
        TNM();
        });
    }
    
    //n
    var posnodes = $('.nodes').val();
    if(posnodes!="")
    {
        document.getElementById('valueN').innerHTML = assignN(posnodes);
    }
    else
    {
        document.getElementById('valueN').innerHTML = "NX";
    }
//m

//selects
    document.getElementById('valueM').innerHTML =selectF('distantM');
//radio
    TNM();
});

function assignN(PositiveN)
{
    if(PositiveN=="1")
    {
        return "N0";
    }
    else 
    {
        return "N1";
    }
}
function resetDistantT()
{
	$('#lesion').prop('selectedIndex', 0);
	TNM();
}
function resetInv()
{
	$('#invasion').prop('selectedIndex', 0);
	TNM();
}
function resetDistantM()
{
	$('#distantM').prop('selectedIndex', 0);
	document.getElementById("valueM").innerHTML="MX";
	TNM();
}
function selectF(pathname)
{
    var sel = document.getElementById(pathname); // Получаем наш список
    var val = sel.options[sel.selectedIndex].value;
    return val;
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
		  var CancerType =  'Cervix';
		  var utc = new Date().toJSON().slice(0,10);
		  var SGRange = document.getElementById("SGRange").innerHTML;
		  var SimpG = document.getElementById("SimpG").innerHTML;
		  var SG = document.getElementById("SG").innerHTML;
		$.get('/submit_breast',{t:T,n:N,m:M,tnm:TNM,cType:CancerType,time:utc,sgr:SGRange,sim:SimpG,sg:SG},function(data){
        alert(data);
    })
}


function TNM()
{
    var finalT = document.getElementById('valueT').innerHTML;
    var finalN = document.getElementById('valueN').innerHTML;
    var finalM = document.getElementById('valueM').innerHTML;
    document.getElementById('TNM').innerHTML =finalT+finalN+finalM;

    if ((finalT!="TX")||(finalN!="NX")||(finalM!="M0"))
    {

        $.get('/cervix_SG',{T:finalT,N:finalN,M:finalM},function(data){
            document.getElementById('SGRange').innerHTML = data ;
            document.getElementById('SG').innerHTML = data;
            $.get('/cervix_SimpSG',{sg:data},function(result1){
                document.getElementById('SimpG').innerHTML = result1;
                
           
        });
        });
    }
    
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

