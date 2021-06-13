status = "";
objects = [];

function setup(){
    canvas = createCanvas(630, 490);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
}

function start(){
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects";
    object_name = document.getElementById("input_name").value;
}

function modelLoaded(){
    console.log("Model Loaded");
    status = true;
}

function gotResult(error, results){
    if(error){
     console.log(error);
    }
   console.log(results); 
   objects = results;
}

function draw(){
    image(video, 0, 0, 630, 490);

    if(status != ""){
        objectDetector.detect(video, gotResult);
         for(i = 0; i < objects.length; i++){
             document.getElementById("status").innerHTML = "Status: Object Detected";
             fill("#FF0000");
             percent = floor(objects[i].confidence * 100);
             text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 20);
             noFill();
             stroke("#FF0000");
             rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

             if(objects[i].label == object_name){
                 video.stop();
                 objectDetector.detect(gotResult);
                 document.getElementById("status_on_mentioned_object").innerHTML = object_name + " found";
                 synth = window.speechSynthesis;
                 utterThis = new SpeechSynthesisUtterance(object_name + "Found");
                 synth.speak(utterThis);
             } else{
                 document.getElementById("status_on_mentioned_object").innerHTML = object_name + " not found";
             }
         }
    }
}