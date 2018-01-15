// change api
var is_debug = false;
var provider = "openweathermap";

$(function(){
  showSection("loading")
  init();
})


function init(){
  alert("ciao");
  alert("ooo");
  getPosition()
}


function showSection(section){
  $("section").hide()
  $("#"+section).show()
}


function getPosition(){
  debug("find position...")
  if(is_debug){ // if debug use fake location
    getWeather(45.559394399999995, 10.2037211)
  } else {
    navigator.geolocation.getCurrentPosition(function(position) {
      debug(position)
      getWeather(position.coords.latitude,position.coords.longitude)
    });
  }
}


function getWeather(lat, lng) {
  debug("getting weather from "+provider+" of lat:" + lat+", lng: "+lng)
  if(provider=="openweathermap") {
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&units=metric&lat="+lat+"&lon="+lng+"&appid=581881e2788f16b15fe091b3bb64ce37"
    $.getJSON(url)
    .done(function( data ) {
      //console.log(data)
      renderWeather(data)
    })
    .fail(function() {
      console.log( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });
  }
  if(provider=="simpleweather") {
    $.simpleWeather({
      location: lat+","+lng,
      woeid: '',
      unit: 'c',
      success: function(w){
        renderWeather(w)
      },
      error: function(){
        debug("ERROR! receiving meteo")
      }
    })
  }
  if(provider=="darksky") {
    /**/
    var url = "https://api.darksky.net/forecast/00c7658658103952f0566b7c8d854765/"+lat+","+lng
    $.getJSON(url)
    .done(function( data ) {
      console.log(data)
    })
    $.getJSON(url, function(data) {
       console.log(data);
       //$('#weather').html('and the temperature is: ' + data.currently.temperature);
     });
  }
}

function renderWeather(data){
  console.log(data)
  showSection("weather")
  renderBackground()
  if(data){
    //For/In Loop -> loops through the properties of an object
    for(var i in data.list) {
      var element = $("#weather > .row > .condition")
      element.find(".city .value").text(data.city.name)
      //if(i!=0) element = element.clone().appendTo( "#forecast" ); // duplicate condition
      today = new Date().getDay();
      
      condition = data.list[i]
      var date = new Date(condition.dt*1000); //l'API ritorna la data in unix cioè in secondi dal 1 gennaio 1970, creando un oggetto della classe "Date"
      //e passandoli come argomento la data in millisecondi noi abbiamo una data in questo formato: Thu Jan 11 2018 12:00:00 GMT+0100 (ora solare Europa occidentale)
      console.log(date);
      if (date.getDay() != today) element = element.clone().appendTo( "#forecast" );

      day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()] //getDay torna il giorno della settimana con un numero da 0 a 6 e in base al numero ritornato li viene assegnata una stringa
      console.log(day);
      //N.B -> Certi elementi non si vedono in #forecast perché nel file _weather.scss sono in display:none
      element.find(".icon i").addClass("wi-owm-"+condition.weather[0].id)
      element.find(".date .value").text(day)
      element.find(".temp .min .value").text(condition.temp.min)
      element.find(".temp .max .value").text(condition.temp.max)
      element.find(".wind .value").text(condition.speed+"ms")
      element.find(".humidity .value").text(condition.humidity+"%")
      element.find(".clouds .value").text(condition.clouds+"%")
      element.find(".description .value").text(condition.weather[0].description)
    }
    $("#weather > .row > .condition").addClass("col-md-4 col-md-offset-4") //Aggiungo le classi di bootstrap per rendere l'app responsive
    $("#weather #forecast > .condition").addClass("col-md-2 col-sm-4") //Aggiungo le classi di bootstrap per rendere l'app responsive
  } else {
    alert("sorry, no weather info!")
  }
}


function renderBackground(){
  var date = new Date();
  var hours = date.getHours();
  var moment = "night";
  if(hours >= 5) moment = "sunrise"
  if(hours >= 7) moment = "morning"
  if(hours >= 12) moment = "afternoon"
  if(hours >= 17) moment = "sunset"
  if(hours >= 18) moment = "twilight"
  if(hours >= 20) moment = "evening"
  if(hours >= 22) moment = "night"
  var background_image = "backogroun-"+moment+".png"
  $("body").css("background-image", "url('"+background_image+"')")
  console.log(background_image)
}

$(document).on('click', "#forecast .condition", function(){
  var todayWeather = $("#weather > .row > .condition").html();
  var clickWeather = $(this).html();

  $(this).html(todayWeather);
  $("#weather > .row > .condition").html(clickWeather);
  
});

function debug(obj){
  console.log(obj)
}
