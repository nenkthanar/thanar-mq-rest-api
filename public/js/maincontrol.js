var count=0;
var socket = io();
var json_encode;
var json_parse;
var save_auto=false;
var read_auto=false;

//begin=============json object สำหรับการเก็บค่าที่ถูกส่งมาจาก esp 8266
var adc_data={
    "temp":[],
    "humid":[],
    "time":[]
};
//end==============json object สำหรับการเก็บค่าที่ถูกส่งมาจาก esp 8266

//begin=============socket.io funtion event handler รอรับข้อมูลที่ส่งผ่าน websocket ผ่านเซิร์ฟเวอร์มายัง web app
socket.on('Client:raw_data', function(msg) {
var input=JSON.parse(msg);
var d = new Date();
var m = d.getMinutes();
var h =d.getHours();  
var s =d.getSeconds();
var t=String(h)+':'+String(m)+':'+String(s);
adc_data.temp.push(input.temp);
adc_data.time.push(t);  
adc_data.humid.push(input.humid);
json_encode=JSON.stringify(adc_data);
var obj=JSON.parse(msg);
addData(myChart,t, obj.temp,obj.humid);
count++;
if(count>50){
moveChart(myChart)
}
}); 
//end=============socket.io funtion event handler รอรับข้อมูลที่ส่งผ่าน websocket ผ่านเซิร์ฟเวอร์มายัง web app

function check_json(){
var val =localStorage.getItem("adc");
json_parse=JSON.parse(val);
document.getElementById("show-one").innerHTML=" Reccord no :"+json_parse.adc.length;
}

function save_adc(){//======funtion บันทึกข้อมูลลงความจำของเครื่อง Client
localStorage.setItem("adc",json_encode);
}

function read_adc(){//======funtion อ่านข้อมูลออกมาจากความจำของเครื่อง Client
var val=localStorage.getItem("adc")
document.getElementById("show-one").innerHTML=val
}

//begin=======ประกาศตัวแปร อ็อบเจ็กและสร้าง atribute ต่างๆ สำหรับสร้าง กราฟด้วย chart.js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
type: 'line',
data: {
labels: [""],
datasets: [{
label: 'ESP8266 temp',
            data: [],
            pointRadius: 1,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: 
                'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
        {
            label: 'ESP8266 humid',
                        data: [],
                        pointRadius: 1,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: 
                            'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }
                ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    fontFamily: "Verdana",
                    fontSize:"14"
                }
            }]
        }
    }
   });
   var ctx_history = document.getElementById('history-chart').getContext('2d');
   var historyChart = new Chart(ctx_history, {
    type: 'line',
    data: {
    labels: [""],
    datasets: [{
    label: 'ESP8266 ADC',
                data: [],
                pointRadius: 1,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: 
                    'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'ESP8266 ADC',
                            data: [],
                            pointRadius: 1,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: 
                                'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        }
                    ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        fontFamily: "Verdana",
                        fontSize:"14"
                    }
                }]
            }
        }
       });
//end========ประกาศตัวแปร อ็อบเจ็กและสร้าง atribute ต่างๆ สำหรับสร้าง กราฟด้วย chart.js

  function draw_historyChart(){
   var val=localStorage.getItem("adc");
   var json_history=JSON.parse(val);
   for(i=0;i<json_history.temp.length;i++){
    addData(historyChart,json_history.time[i],json_history.temp[i],json_history.humid[i]);
   }
   }
  
     function addData(chart, label, data,data1) {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(data);
      chart.data.datasets[1].data.push(data1);
      chart.update();
      }

    function moveChart(chart) {//=====funtion เลื่อตำแหน่ของกราฟเพือ่ให้เกิดการแสดงกราฟแบบ real time
    chart.data.labels.splice(0, 1);
    chart.data.datasets[0].data.splice(0, 1);
    chart.data.datasets[1].data.splice(0, 1);
    chart.update();
    }

   function destroy_history(){
    var val=localStorage.getItem("adc");
    var json_parse=JSON.parse(val);
    for(i=0;i<json_parse.temp.length+2;i++){
    moveChart(historyChart);
    }
    }

    $(document).ready(function() {//===funtion ตรวจจับการทำกดปุ่ม check box เพื่อทำงานตามเงื่อนไขอัตโนมัติ
        $(' #auto1').on('click', function() {
        var chk1_ischecked=$('#auto1').is(':checked');
        if(chk1_ischecked){
        alert("Auto save")
        save_auto=true;
        auto_save();
        }else{
         alert("Cancel auto save")
         save_auto=false;
        }
        });
         $(' #auto2').on('click', function() {
        var chk2_ischecked=$('#auto2').is(':checked');  
        if(chk2_ischecked){
        alert("Auto read");
        read_auto=true;
        auto_read();
        }else{
        alert("Cancel auto read")
        read_auto=false;
        }
        });
        });
        
        function auto_save(){//=================funtion บันทึกข้อมูลอัตโนมัติ
        setInterval(function(){ 
         if(save_auto){
         save_adc();
         check_json();
         }
         },  3000);
        
        }
        
        function auto_read(){//=================funtion อ่านแสดงข้อมูลอัตโนมัติ
        setInterval(function(){ 
        if(read_auto){
        read_adc();
        }
         },  3000); 
        }