
$('body').click(function(){
//----------------------------------------------------
//My one!
//t
//selects
    var appearance = selectF('appearance');
    if(appearance!="")
    {
        var appearance = parseInt(appearance);
    }
    var extension = selectF('extension');
    if(extension!="")
    {
        var extension = parseInt(extension);
    }    
//radiobuttons
    var Capsule = getRadiobutton("input[type='radio'][name='data[T[Capsule]]']:checked");
    var Neck = getRadiobutton("input[type='radio'][name='data[T[Neck]]']:checked");
    var Vescicles = getRadiobutton("input[type='radio'][name='data[T[Vescicles]]']:checked");
    var Bladder = getRadiobutton("input[type='radio'][name='data[T[Bladder]]']:checked");
    var Sphincter = getRadiobutton("input[type='radio'][name='data[T[Sphincter]]']:checked");
    var Rectum = getRadiobutton("input[type='radio'][name='data[T[Rectum]]']:checked");
    var Wall = getRadiobutton("input[type='radio'][name='data[T[Wall]]']:checked");
    if((appearance!="")||(Capsule=='T')||(Neck=="T")||(Vescicles=="T")||(Bladder=="T")||(Sphincter=="T")||(Rectum=="T")||(Wall=="T"))
    {
            if (assignT(Capsule,Neck,Vescicles,Bladder,Sphincter,Rectum,Wall,appearance,extension)=="More")
            {
                    $.get('/prostate_t',{ap:appearance,ex:extension},function(data){
                    document.getElementById('valueT').innerHTML = data;
        TNM();
        });
            }
            else
            {
                document.getElementById('valueT').innerHTML=assignT(Capsule,Neck,Vescicles,Bladder,Sphincter,Rectum,Wall,appearance,extension);
            TNM();
            }
            
            
    }
    else
    {
        document.getElementById('valueT').innerHTML="TX";
    }

//n
    var posnodes = $('.posnodes').val();
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
    var metastas = parseInt(selectF('metastas'));
//radio
    var Bone = getRadiobutton("input[type='radio'][name='data[M[Bone]]']:checked");
    var Nodes = getRadiobutton("input[type='radio'][name='data[M[Nodes]]']:checked");
    var Other = getRadiobutton("input[type='radio'][name='data[M[Other]]']:checked");
    document.getElementById('valueM').innerHTML = assignM(metastas,Bone,Nodes,Other);
    TNM();
//s
var gleason =  $('.gleason').val();
if(gleason!='')
{
    //alert(gleason);
}

//total
});


function assignT(Capsule,Neck,Vescicles,Bladder,Sphincter,Rectum,Wall,appearance,extension)
{
    var answer;
    if((Bladder=="T")||(Sphincter=="T")||(Rectum=="T")||(Wall=="T"))
    {
        return "T4";
    }
    else if(Vescicles=="T")
    {
        return "T3b";
    }
    else if((Capsule=='T')||(Neck=="T"))
    {
        return "T3a";
    }
    else
    {
        return "More";
    }
}

function resetDistantM()
{
	$('#metastas').prop('selectedIndex', 0);
	document.getElementById("valueM").innerHTML="M0";
	TNM();
}
function TNM()
{
    var finalT = document.getElementById('valueT').innerHTML;
    var finalN = document.getElementById('valueN').innerHTML;
    var finalM = document.getElementById('valueM').innerHTML;
    document.getElementById('TNM').innerHTML =finalT+finalN+finalM;
    var psa = findPsa();
    var gleason = findGleason();
    if ((finalT!="TX")||(finalN!="NX")||(finalM!="M0"))
    {
        
        $.get('/prostate_SG',{T:finalT,N:finalN,M:finalM,P:psa,G:gleason},function(data){
         document.getElementById('SG1').innerHTML = data ;
         document.getElementById('SGRange').innerHTML = data;
        });
    }
    
}
function findPsa()
{
var gleason =  $('.gleason').val();
if(gleason!='')
{
    if((gleason>1)&&(gleason<7))
	{
		return 1;
	}
	else if(gleason==7)
	{
		return 2;
	}
	else if((gleason>7)&&(gleason<11))
	{
		return 3;
	}
}
else
{
    return "";
}
}
function findGleason()
{
var psa =  $('.psa').val();
if(psa!='')
{
    if((psa>0)&&(psa<9))
	{
		return 1;
	}
	else if((psa>10)&&(psa<20))
	{
		return 2;
	}
	else if((psa>19)&&(psa<1000))
	{
		return 3;
	}
}
else
{
    return "";
}
}


function resetForm()
{
          document.getElementById("table_form").reset();
		  document.getElementById("valueT").innerHTML="TX";
		  document.getElementById("valueN").innerHTML="NX";
		  document.getElementById("valueM").innerHTML="M0";
		  document.getElementById("TNM").innerHTML="";  
		  document.getElementById("SGRange").innerHTML="";
		  document.getElementById("SG1").innerHTML="";
		  $('.gleason').val() = "";
		  $('.psa').val() = "";
}
function submitForm()
{
		  var T  = document.getElementById("valueT").innerHTML;
		  var N = document.getElementById("valueN").innerHTML;
		  var M = document.getElementById("valueM").innerHTML;
		  var TNM = document.getElementById("TNM").innerHTML;
		  var CancerType =  'Prostate';
		  var utc = new Date().toJSON().slice(0,10);
		  var SGRange = document.getElementById("SGRange").innerHTML;
		  var SimpG = "";
		  var SG = document.getElementById("SG1").innerHTML;
		$.get('/submit_breast',{t:T,n:N,m:M,tnm:TNM,cType:CancerType,time:utc,sgr:SGRange,sim:SimpG,sg:SG},function(data){
        alert(data);
    })
}

function resetAp()
{
	$('#appearance').prop('selectedIndex', 0);
	TNM();
}
function resetEx()
{
	$('#extension').prop('selectedIndex', 0);
	TNM();
}


function assignM(metastas,bone,nonNodes,other)
{
    if(metastas==1)
    {
        return "M0";
    }
    else
    {
        if(other=="T")
        {
            return "M1c";
        }
        else if(bone=="T")
        {
            return "M1b";
        }
        else if(nonNodes=="T")
        {
            return "M1a";
        }
        else{
            return "M1";
        }
    }
}
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



function getRadiobutton(pathname)
{
    var result = "";
    var selected = $(pathname);
    if (selected.length > 0) {
    result = selected.val();
    }
    return result;
}
function selectF(pathname)
{
    var sel = document.getElementById(pathname); // Получаем наш список
    var val = sel.options[sel.selectedIndex].value;
    return val;
}