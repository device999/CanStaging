var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportlocal = require('passport-local');
var i18n = require('./i18n');
var jquery = require('jquery');
var jsonfile = require('jsonfile');


var loki = require('lokijs');
//create a datastore.
var db = new loki('db/loki.db');
//create a collection
var user = db.addCollection('user');
//insert test user to database
user.insert({name: 'user', password: 'test', id: 'user'});
//save datastore 

var app = express();

app.use("/public", express.static(__dirname + '/public'));

//view engine setup
app.set('views', __dirname + '/view');
app.set('view engine', 'pug');

//register bodyParser, cookieParser, expressSession middlewares.
app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json()); //Parses the text as JSON and exposes the resulting object on req.body.
app.use(cookieParser());
app.use(expressSession({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(i18n);


//register passport middlewares (grap and put in passport session)
app.use(passport.initialize());
app.use(passport.session());

//passport verify user
//with passport-local 
passport.use(new passportlocal.Strategy(verifyCredentials));

//verify user credentials that entered in login
function verifyCredentials(username, password, done){
	//check if DB contains username&password
	if (user.findOne({'$and': [{ 'name' : username},{'password' : password}]})) {
		done(null,{id:username});
	} else{
		done(null,false);
	}
}

//passport serialize users
passport.serializeUser(function(user, done){
	done(null,user.id);
});

//passport deserialize users
passport.deserializeUser(function(id, done){
	 if (user.findOne({'id': id })){
	 	done(null,{id: id});
	 };
})
app.get('/singup',function(req,res){
    res.render( __dirname + "/view/" + "signup.pug" );
});
app.get('/reg',function(req,res){
	var username = req.param('login');
	var pass = req.param('password');
user.insert({name: username, password: pass, id: username});
db.saveDatabase();
res.send( '/' );
});
var idr = 1;
var sub = new loki('db/Submit.db');
var breast = sub.addCollection('Breast');
//Sattar
app.get('/submit_breast',function(req,res){
var t = req.param('t');
var n = req.param('n');
var m = req.param('m');
var tnm12 = req.param('tnm');
var cType = req.param('cType');
var time = req.param('time');
var sgr = req.param('sgr');
var sim = req.param('sim');
var sg = req.param('sg');
breast.insert({id:idr,Date:time, Site:cType, T:t, N:n,M:m, TNM:tnm12 ,TNMmes:'blank',SGResult:sgr,SGMessage:'Message',SimpG:sim,SGRange:sg,SiteSpecification:'blank'});
idr = idr + 1;
res.send("Done");
});
app.get('/onLoad',function(req,res){
	var counter = req.param('count');
	var arr= [];
	if(breast.get(counter)!==null)
	{

	var x = breast.get(counter);
	var i = 1;
	   for(var key in x){
		 var value = x[key];
        arr[i] = value;
		i++;        
	}
	arr[0] = 0;
	res.send(arr);
	}
	else
	{
		arr[0] = 1;
		res.send(arr);
	}

})
app.get('/clearLog',function(req,res){
	var list = breast.find();
	//console.log(list.length);
	for(var z = list.length -1; z >= 0; z--) {
        breast.remove(list[z]);
	}
	res.send("deleted");
});
app.get('/downloadLog',function(req,res){
	fs=require("fs");
	var stream = fs.createWriteStream(__dirname + "/public/my_file.txt");
	stream.once('open', function(fd) {
  
  var list = breast.find();
	var arr = [];
	i=0;
	for(var z = 0; z <list.length; z++) {
		
		stream.write('Result \n');
		stream.write('id = '+list[z].id+"\n");
		stream.write('Date = '+list[z].Date+"\n");
		stream.write('Site = '+list[z].Site+"\n");
		stream.write('T = '+list[z].T+"\n");
		stream.write('N = '+list[z].N+"\n");
		stream.write('M = '+list[z].M+"\n");
		stream.write('TNM = '+list[z].TNM+"\n");
		stream.write('TNM Message = '+list[z].TNMmes+"\n");
		stream.write('SG Result = '+list[z].SGResult+"\n");
		stream.write('SG Message = '+list[z].SGMessage+"\n");
		stream.write('SimpG = '+list[z].SimpG+"\n");
		stream.write('SG Range = '+list[z].SGRange+"\n");
		stream.write('Site Specification = '+list[z].SiteSpecification+"\n");
		stream.write('-------------------------------------- \n');
	}
	  stream.end();
});

	res.send("./public/my_file.txt" );
});


var Converter = require("csvtojson").Converter;
app.get('/breast_m',function(req,res){
var converter = new Converter({});
var metoz = parseInt(req.param('met'));
//read from file 
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Breast_M.db');
   var breastM = db.addCollection('m');
   var i;
   for (var i =0;i<jsonArray.length;i++)
   {
       breastM.insert(jsonArray[i]);
   }
   var x = breastM.find( {'M':metoz} );
   db.saveDatabase();
   for(var key in x){
        var value = x[key];        
}
    res.send(value.Result);
});
require("fs").createReadStream("./data/Breast/Breast_M.txt").pipe(converter);
})

app.get('/breast_ranget',function(req,res){

var converter = new Converter({});
var t = parseFloat(req.param('diapazon'));
var result;
converter.on("end_parsed", function (jsonArray) {
   for (var i =0;i<jsonArray.length;i++)
   {
    if((t>=jsonArray[i].Min) && (t<=jsonArray[i].Max))
    {
        result = jsonArray[i].Key;
    }    
   }
   //console.log(result.toString());
    if (result==undefined)
	{
		res.send()
	}
	else
	{
		res.send(result.toString());
	}
	

});
require("fs").createReadStream("./data/Breast/Breast_T_Size_Range.txt").pipe(converter);
})


app.get('/breast_t',function(req,res){

var converter = new Converter({});
var met = parseInt(req.param('tumour'));
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Breast_T.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   var x = tFinal.find( {"Size" :met} );
   db.saveDatabase();
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   //console.log(x[0].Result);
	   res.send(x[0].Result);
   }
});
 
//read from file 
require("fs").createReadStream("./data/Breast/Breast_T.txt").pipe(converter);
})
//Needed to be done!
app.get('/breast_n',function(req,res){
    var mamN = req.param('mamN');
    var mam = req.param('mam');
    var mamD = req.param('mamD');
    var infr = req.param('infr');
    var supr = req.param('supr');
    var valueN = parseInt(req.param('dat'));
    var answer= "";
    
    var converter = new Converter({});
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Breast_N.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'Micrometastases' : { '$containsAny' : [mamN, 'ANY'] } },
        { 'MammaryMicro' : { '$containsAny' : [mam, 'ANY'] } },
        { 'MammaryClinical' : { '$containsAny' : [mamD, 'ANY'] } },
        { 'Infraclavicular' : { '$containsAny' : [infr, 'ANY'] } },
        { 'Supraclavicular' : { '$containsAny' : [supr, 'ANY'] } }
    ]
});
if (req.param('dat')!="")
{
	   for(var key in x){   
		if((x[key].Axillary==valueN)||(x[key].Axillary=="ANY"))
		{
			answer =x[key].Result;
		}
	}
}
else
{
	   for(var key in x){   
		if(x[key].Axillary=="ANY")
		{
			answer =x[key].Result;
		}
}
}
   if (answer=="")
   {
	   answer = "NX";
   }
   db.saveDatabase();
   //console.log(answer);
   res.send(answer);   
});
 
//read from file 
require("fs").createReadStream("./data/Breast/Breast_N.txt").pipe(converter);
});
//Finalqueries
app.get('/breast_SG',function(req,res){

var converter = new Converter({});
var t = req.param('T');
var n = req.param('N');
var m = req.param('M');
//console.log(t);
//console.log(n);
//console.log(m);
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Breast_SG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'T' : t},
        { 'N' : n},
        { 'M' : m}
    ]
});
   db.saveDatabase();
   //console.log(x);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   //console.log(x[0].Result);
	   res.send(x[0].Result);
   }

});
//read from file 
require("fs").createReadStream("./data/Breast/Breast_SG.txt").pipe(converter);
});


app.get('/breast_SimpSG',function(req,res){

var converter = new Converter({});
var sg = req.param('sg');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Breast_SimpG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'SG' : sg},
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});

//read from file 
require("fs").createReadStream("./data/Breast/Breast_SimpG.txt").pipe(converter);
});
 

//endFinalqueries

//colorectal

app.get('/colorectal_n',function(req,res){

var converter = new Converter({});
var nodes = parseInt(req.param('node'));
var tumor = req.param('tum');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Colorectal_N.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   var x = tFinal.find({
    $and: [
        { 'PositiveN' : nodes },
        { 'TumourDeposit' : { '$containsAny' : [tumor, 'ANY'] } }
    ]
});

   db.saveDatabase();
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});
require("fs").createReadStream("./data/Colorectal/Colorectal_N.txt").pipe(converter);
});

app.get('/colorectal_SG',function(req,res){

var converter = new Converter({});
var t = req.param('T');
var n = req.param('N');
var m = req.param('M');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Colorectal_SG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'T' : t},
        { 'N' : n},
        { 'M' : m}
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }

});
//read from file 
require("fs").createReadStream("./data/Colorectal/Colorectal_SG.txt").pipe(converter);
});


app.get('/colorectal_SimpSG',function(req,res){

var converter = new Converter({});
var sg = req.param('sg');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Colorectal_SimpG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'SG' : sg},
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});

//read from file 
require("fs").createReadStream("./data/Colorectal/Colorectal_SimpG.txt").pipe(converter);
});


//endcolorectal
//lung 

app.get('/lung_ranget',function(req,res){

var converter = new Converter({});
var t = parseFloat(req.param('value'));
var result;
converter.on("end_parsed", function (jsonArray) {
   for (var i =0;i<jsonArray.length;i++)
   {
    if((t>=jsonArray[i].Min) && (t<=jsonArray[i].Max))
    {
        result = jsonArray[i].Key;
    }    
   }
   
if(result!=undefined)
{
	res.send(result.toString());
}
else
{
	res.send("");
}
	

});
require("fs").createReadStream("./data/Lung/Lung_T_Size_Range.txt").pipe(converter);
});

app.get('/lung_t',function(req,res){

var converter = new Converter({});
var s = req.param('tsize');
var br = req.param('invas');
var pl = req.param('pl');
var at = req.param('at');
var inv = req.param('inv');
var tmod = req.param('tmod');
var pneu = req.param('pneu');
var vocord = req.param('vocord');
var ipsi = req.param('ipsi');
var tmhg = req.param('tmhg');
var result;
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Lung_T.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
		{ 'Pleura' :{'$containsAny':[pl,'ANY']}},
		{ 'Atelectasis' :{'$containsAny':[at,'ANY']}},
		{ 'T3invasion' :{'$containsAny':[inv,'ANY']}},
		{ 'AtelectasisAll' :{'$containsAny':[pneu,'ANY']}},
		{ 'NodulesT3' :{'$containsAny':[tmod,'ANY']}},
		{ 'Vocal' :{'$containsAny':[vocord,'ANY']}},
		{ 'T4invasion' :{'$containsAny':[tmhg,'ANY']}},
		{ 'NodulesT4' :{'$containsAny':[ipsi,'ANY']}}
    ]
});
if(isNaN(parseInt(s)))
{
	 for(var key in x)
		{
        if(((x[key].Bronchus=="ANY")||(x[key].Bronchus==br))&&((x[key].Size!="ANY")&&(isNaN(parseInt(x[key].Size)))))
		{
			//console.log('inside');
			result = x[key].Result;
			//console.log(result);
		}
		}
}
else
{
	 for(var key in x)
		{
        if(((x[key].Bronchus=="ANY")||(x[key].Bronchus==br))&&((x[key].Size=="ANY")||(x[key].Size==s)))
		{
		result = x[key].Result;
		//console.log(x[key]);
		}
		}
}
db.saveDatabase();
if(result=="")
{
	result = "TX";
	//console.log(result);
	res.send(result);
}
else
{
	//console.log(result);
	res.send(result)
}

   
});
//read from file 
require("fs").createReadStream("./data/Lung/Lung_T.txt").pipe(converter);
});

//----------------------


app.get('/lung_t2',function(req,res){

var converter = new Converter({});
var br = req.param('invas');
var pl = req.param('pl');
var at = req.param('at');
var inv = req.param('inv');
var tmod = req.param('tmod');
var pneu = req.param('pneu');
var vocord = req.param('vocord');
var ipsi = req.param('ipsi');
var tmhg = req.param('tmhg');
var result;
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Lung_T.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
		{ 'Pleura' :{'$containsAny':[pl,'ANY']}},
		{ 'Atelectasis' :{'$containsAny':[at,'ANY']}},
		{ 'T3invasion' :{'$containsAny':[inv,'ANY']}},
		{ 'AtelectasisAll' :{'$containsAny':[pneu,'ANY']}},
		{ 'NodulesT3' :{'$containsAny':[tmod,'ANY']}},
		{ 'Vocal' :{'$containsAny':[vocord,'ANY']}},
		{ 'T4invasion' :{'$containsAny':[tmhg,'ANY']}},
		{ 'NodulesT4' :{'$containsAny':[ipsi,'ANY']}}
    ]
});


	 for(var key in x)
		{
        if((x[key].Bronchus=="ANY")||(x[key].Bronchus==br))
		{
		result = x[key].Result;
		//console.log(x[key]);
		}
		}

db.saveDatabase();
if(result=="")
{
	result = "TX";
	//console.log(result);
	res.send(result);
}
else
{
	//console.log(result);
	res.send(result);
}

   
});
//read from file 
require("fs").createReadStream("./data/Lung/Lung_T.txt").pipe(converter);
});


app.get('/Lung_SG',function(req,res){

var converter = new Converter({});
var t = req.param('T');
var n = req.param('N');
var m = req.param('M');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Lung_SG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'T' : t},
        { 'N' : n},
        { 'M' : m}
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }

});
//read from file 
require("fs").createReadStream("./data/Lung/Lung_SG.txt").pipe(converter);
});


app.get('/lung_SimpSG',function(req,res){

var converter = new Converter({});
var sg = req.param('sg');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Lung_SimpG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'SG' : sg},
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});

//read from file 
require("fs").createReadStream("./data/Lung/Lung_SimpG.txt").pipe(converter);
});




//read from file 
//prostate
app.get('/prostate_t',function(req,res){

var converter = new Converter({});
var Appearance = parseInt(req.param('ap'));
var Extension;
if(req.param('ex')=="")
{
	Extension='';
}
else
{
	Extension = parseInt(req.param('ex'));
}
//console.log(Appearance);
//console.log(Extension);
var result1="";
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Prostate_T.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
		{ 'Extension' :Extension},
		{ 'Appearance' :Appearance}
    ]
});
   db.saveDatabase();   
      if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});
//read from file 
require("fs").createReadStream("./data/Prostate/Prostate_T.txt").pipe(converter);
});

app.get('/prostate_SG',function(req,res){

var converter = new Converter({});
var t = req.param('T');
var n = req.param('N');
var m = req.param('M');
var p = req.param('P');
var g = req.param('G');
var result;
converter.on("end_parsed", function (jsonArray) {
   var loki = require('lokijs');
   var db = new loki('db/Prostate_SG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
		//console.log(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'T' : {'$containsAny':[t,'ANY']}},
        { 'N' : {'$containsAny':[n,'ANY']}},
        { 'M' : {'$containsAny':[m,'ANY']}}
    ]
});
   db.saveDatabase();
   //console.log(x);
   if((p!='')&&(g!=''))
   {
	    for(var key in x){
		if(((x[key].PSA=="ANY")||(x[key].PSA==p))&&((x[key].Gleason=="ANY")||(x[key].Gleason==g)))
		{
			//console.log(x[key]);
			result = x[key].Result;
			
		}
		}
	}
	else if((p!='')&&(g==''))
	{
	    for(var key in x){
		if(((x[key].PSA=="ANY")||(x[key].PSA==p))&&(x[key].Gleason=="ANY"))
		{
			//console.log(x[key]);
			result = x[key].Result;
		}
		}
	}
	else if((p=='')&&(g!=''))
	{
	    for(var key in x){
		if((x[key].PSA=="ANY")&&((x[key].Gleason=="ANY")||(x[key].Gleason==g)))
		{
			//console.log(x[key]);
			result = x[key].Result;
		}
		}
	}
	else
	{
	    for(var key in x){
		if((x[key].PSA=="ANY")&&(x[key].Gleason==g))
		{
			//console.log(x[key]);
			result = x[key].Result;
		}
		}
	}
	if (result!="")
	{
		res.send(result);
	}
	else
	{
		res.send();
	}


});
//read from file 
require("fs").createReadStream("./data/Prostate/Prostate_SG.txt").pipe(converter);
});


app.get('/prostate_SimpSG',function(req,res){

var converter = new Converter({});
var sg = req.param('sg');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Prostate_SimpG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'SG' : sg},
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});

//read from file 
require("fs").createReadStream("./data/Prostate/Prostate_SimpG.txt").pipe(converter);
});

//cervix
app.get('/cervix_t',function(req,res){

var converter = new Converter({});

var BeyondUterus = req.param('but');
var Microscopic = req.param('micro');
var Stromal = req.param('strom');
var ExtendedVisible = req.param('exvis');
var Parametrium = req.param('param');
var Vagina = req.param('vag');
var Pelvis = req.param('pel');
var Hydronephrosis = req.param('hydro');
var Mucosa = req.param('mucosa');

var result;
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Cervix_T.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
		{ 'BeyondUterus' :{'$containsAny':[BeyondUterus,'ANY']}},
		{ 'Microscopic' :{'$containsAny':[Microscopic,'ANY']}},
		{ 'Parametrium' :{'$containsAny':[Parametrium,'ANY']}},
		{ 'Vagina' :{'$containsAny':[Vagina,'ANY']}},
		{ 'Pelvis' :{'$containsAny':[Pelvis,'ANY']}},
		{ 'Hydronephrosis' :{'$containsAny':[Hydronephrosis,'ANY']}},
		{ 'Mucosa' :{'$containsAny':[Mucosa,'ANY']}}
    ]
});


	 for(var key in x)
		{
        if(((x[key].Stromal=="ANY")||(x[key].Stromal==Stromal))&&(((x[key].ExtendedVisible=="ANY")||(x[key].ExtendedVisible==ExtendedVisible))))
		{
		result = x[key].Result;
		//console.log(x[key]);
		}
		}

db.saveDatabase();
if(result==undefined)
{
	result = "TX";
	//console.log(result);
	res.send(result);
}
else
{
	//console.log(result);
	res.send(result);
}

   
});
//read from file 
require("fs").createReadStream("./data/Cervix/Cervix_T.txt").pipe(converter);
});
app.get('/cervix_SG',function(req,res){

var converter = new Converter({});
var t = req.param('T');
var n = req.param('N');
var m = req.param('M');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Cervix_SG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'T' : t},
        { 'N' : n},
        { 'M' : m}
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }

});
//read from file 
require("fs").createReadStream("./data/Cervix/Cervix_SG.txt").pipe(converter);
});


app.get('/cervix_SimpSG',function(req,res){

var converter = new Converter({});
var sg = req.param('sg');
converter.on("end_parsed", function (jsonArray) {
   
   var db = new loki('db/Cervix_SimpG.db');
   var tFinal = db.addCollection('Tr');
   for (var i =0;i<jsonArray.length;i++)
   {
        tFinal.insert(jsonArray[i]);
   }
   //var x = tFinal.find(query);
   var x = tFinal.find({
    $and: [
        { 'SG' : sg},
    ]
});
   db.saveDatabase();
   ////console.log(x[0].Result);
   if(x[0] == undefined)
   {
	   res.send();
   }
   else
   {
	   res.send(x[0].Result);
   }
});

//read from file 
require("fs").createReadStream("./data/Cervix/Cervix_SimpG.txt").pipe(converter);
});



//End Sattar







app.get('/', function(req,res){
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
   		user:req.user
	});
})

app.post('/', passport.authenticate('local', {
	successRedirect: 'site',
	failureRedirect: '/attempt'
}))

//wrong credentials in login
app.get('/attempt',function(req,res){
	res.render('index2', {
		isAuthenticated: req.isAuthenticated(),
   		user:req.user
	});
})

//use passport-local for authentication of user
app.post('/attempt', passport.authenticate('local', {
	successRedirect: 'site',
	failureRedirect: '/attempt'
}))

//site page after login
app.get('/site',function(req,res){
	res.render('site',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})

app.post('/site', passport.authenticate('local', {
	successRedirect: 'site',
	failureRedirect: '/attempt'
}))


app.get('/getLog',function(req,res){
	res.render('getLog',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})

//breast 
app.get('/site/breast', function(req,res){
	res.render(__dirname+'/view/site/breast',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})
app.post('/site/breast', passport.authenticate('local', {
	successRedirect: '/site',
	failureRedirect: '/attempt'
}))



//cervix
app.get('/site/cervix', function(req,res){
	res.render(__dirname+'/view/site/cervix',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})
app.post('/site/cervix', passport.authenticate('local', {
	successRedirect: '/site',
	failureRedirect: '/attempt'
}))



//colorectal
app.get('/site/colorectal', function(req,res){
	res.render(__dirname+'/view/site/colorectal',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})
app.post('/site/colorectal', passport.authenticate('local', {
	successRedirect: '/site',
	failureRedirect: '/attempt'
}))



//lung
app.get('/site/lung', function(req,res){
	res.render(__dirname+'/view/site/lung',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})
app.post('/site/lung', passport.authenticate('local', {
	successRedirect: '/site',
	failureRedirect: '/attempt'
}))



//prostate
app.get('/site/prostate', function(req,res){
	res.render(__dirname+'/view/site/prostate',{
		isAuthenticated: req.isAuthenticated(),
		user:req.user
	});
})
app.post('/site/prostate', passport.authenticate('local', {
	successRedirect: '/site',
	failureRedirect: '/attempt'
}))



//logout removes the req.user property and clears the login session 
app.get('/logout',function(req,res){
	req.logout(); // passport adds logout to request object
	res.redirect('/'); // after logout redirect to login page
})


var port = 3000;
app.listen(port,function(){
	console.log('http://127.0.0.1:' + port +'/');
})

