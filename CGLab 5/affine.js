const canvas = document.querySelector('.fractal-cover');
const ctx = canvas.getContext('2d');
let grid_size = 25;
let x_axis_distance_grid_lines = 10;
let y_axis_distance_grid_lines = 10;
let currentZoom = 4;
let moving = false;
let zoomAssets = [
    [17,15],
    [18,14],
    [19,13],
    [21,12],
    [23,11],
    [25,10],
    [28,9],
    [31,8],
    [36,7],
    [42,6],
]
let center = [25,-25];
const a = 2 * Math.PI / 6;
let r = 50;
let i = 0;
let interval;
let hexagonParts = new Array(12);
function init() {
    canvas.width = 500;
    canvas.height = 500;
    drawPoligon(i,grid_size,x_axis_distance_grid_lines,y_axis_distance_grid_lines);
}
init();
let runnable= false;
let bool = false;
document.querySelector('.draw').addEventListener('click',()=>{
    bool = true;
    draw();
});
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    i++;
    drawPoligon(i,grid_size,x_axis_distance_grid_lines,y_axis_distance_grid_lines);
    if(!bool){
      return;
    }
    runnable = true;
    r = parseFloat(document.querySelector('#side-length').value);
    r *= grid_size;
    center[0] = parseFloat(document.querySelector('#x-center').value) * grid_size;
    center[1] = parseFloat(document.querySelector('#y-center').value) == 0? 0: parseFloat(document.querySelector('#y-center').value)* -1 *grid_size;
    for (var i = 0; i < 6; i++) {
        hexagonParts[i] = center[0] + r * Math.cos(a * i);
        hexagonParts[i+6] =  center[1] + r * Math.sin(a * i);
    }
    Array.from(document.querySelectorAll('option')).forEach((option,index)=>{
        if(index !==6){
            let x = (hexagonParts[index]/grid_size).toFixed(2) == 0? 0 :(hexagonParts[index]/grid_size).toFixed(2); 
            let y = (hexagonParts[index+6]/(-grid_size)).toFixed(2) ==0? 0: (hexagonParts[index+6]/(-grid_size)).toFixed(2);
            option.innerHTML = `Вершина(${x} , ${y})`;
        }
    })
    document.querySelector('option:last-child').innerHTML = `Центр(${center[0]/grid_size} , ${center[1]/(-grid_size)})`;
    drawHexagon();
}
document.querySelector('.start').addEventListener('click',start);
function start(){
    if(runnable){
        runnable = false;
        moving = true;
        let pointIndex = parseInt(document.querySelector('#rotation-point').value);
        let rotatingKoeficient = parseFloat(document.querySelector('#koef').value);
        console.log(rotatingKoeficient);
        pointIndex--;
        if(pointIndex == 6){
            rotatingPoint = {x: center[0], y: center[1]};
        } else{
            rotatingPoint = {x: hexagonParts[pointIndex], y: hexagonParts[pointIndex+6]};
        }
        interval = setInterval(()=>{
            i++;
            drawPoligon(i,grid_size,x_axis_distance_grid_lines,y_axis_distance_grid_lines);
            drawHexagon(center[0],center[1]);
            rotateHexagon(rotatingPoint,rotatingKoeficient);
        }, 60);
    }
}
document.querySelector('#rotation-point').addEventListener('change',()=>{
    clearInterval(interval);
    moving = false;
    runnable = true;
    draw();
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // i++;
    // drawPoligon(i,grid_size,x_axis_distance_grid_lines,y_axis_distance_grid_lines);
    // r = parseFloat(document.querySelector('#side-length').value);
    // r *= grid_size;
    // center[0] = parseFloat(document.querySelector('#x-center').value) * grid_size;
    // center[1] = parseFloat(document.querySelector('#y-center').value) == 0? 0: parseFloat(document.querySelector('#y-center').value)* -1 *grid_size;
    // for (var i = 0; i < 6; i++) {
    //     hexagonParts[i] = center[0] + r * Math.cos(a * i);
    //     hexagonParts[i+6] =  center[1] + r * Math.sin(a * i);
    // }
    // Array.from(document.querySelectorAll('option')).forEach((option,index)=>{
    //     if(index !==6){
    //         let x = (hexagonParts[index]/grid_size).toFixed(2) == 0? 0 :(hexagonParts[index]/grid_size).toFixed(2); 
    //         let y = (hexagonParts[index+6]/(-grid_size)).toFixed(2) ==0? 0: (hexagonParts[index+6]/(-grid_size)).toFixed(2);
    //         option.innerHTML = `Вершина(${x} , ${y})`;
    //     }
    // })
    // document.querySelector('option:last-child').innerHTML = `Центр(${center[0]/grid_size} , ${center[1]/(-grid_size)})`;
    // drawHexagon();
});
document.querySelector('.stop').addEventListener('click',()=>{
    runnable = true;
    moving = false;
    clearInterval(interval);
})


function drawHexagon(x, y) {
  ctx.beginPath();
  for(let i=0; i < 6; i++){
    ctx.lineTo(hexagonParts[i],hexagonParts[i+6]);
  }
  ctx.closePath();
  ctx.stroke();
}
document.querySelector('.zoom-range').addEventListener('change',()=>{
    let tempGridSize = grid_size;
    let tempX_axis = x_axis_distance_grid_lines;
    let tempY_axis = y_axis_distance_grid_lines;
    currentZoom = parseInt(document.querySelector('.zoom-range').value);
    if(currentZoom >= 9){
        return;
    }
    tempGridSize = zoomAssets[currentZoom][0];
    tempX_axis = zoomAssets[currentZoom][1];
    tempY_axis = zoomAssets[currentZoom][1];
     i++;
    clearInterval(interval);
    drawPoligon(i,tempGridSize,tempX_axis,tempY_axis);
    grid_size = tempGridSize;
    x_axis_distance_grid_lines = tempX_axis;
    y_axis_distance_grid_lines = tempY_axis;
    draw();
    if(moving){
        start();
    }
})
 



function drawPoligon(index, tempGridSize, tempX, tempY){
    var x_axis_starting_point = { number: 1, suffix: '' };
    var y_axis_starting_point = { number: 1, suffix: '' };
    var canvas_width = canvas.width;
    var canvas_height = canvas.height;
    var num_lines_x = Math.floor(canvas_height/tempGridSize);
    var num_lines_y = Math.floor(canvas_width/tempGridSize);
    if(index!=0){
        ctx.translate(-1*y_axis_distance_grid_lines*grid_size, -1* x_axis_distance_grid_lines*grid_size);
        ctx.clearRect(0,0,canvas.width,canvas.height);
    } else{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    for(var i=0; i<=num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        if(i == tempX) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == num_lines_x) {
            ctx.moveTo(0, tempGridSize*i);
            ctx.lineTo(canvas_width, tempGridSize*i);
        }
        else {
            ctx.moveTo(0, tempGridSize*i+0.5);
            ctx.lineTo(canvas_width, tempGridSize*i+0.5);
        }
        ctx.stroke();
    }
    
    for(i=0; i<=num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        if(i == tempY) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == tempY) {
            ctx.moveTo(tempGridSize*i, 0);
            ctx.lineTo(tempGridSize*i, canvas_height);
        }
        else {
            ctx.moveTo(tempGridSize*i+0.5, 0);
            ctx.lineTo(tempGridSize*i+0.5, canvas_height);
        }
        ctx.stroke();
    }
    ctx.translate(tempY*tempGridSize, tempX*tempGridSize);
    
    for(i=1; i<(num_lines_y - tempY); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    
        ctx.moveTo(tempGridSize*i+0.5, -3);
        ctx.lineTo(tempGridSize*i+0.5, 3);
        ctx.stroke();
    
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number*i + x_axis_starting_point.suffix, grid_size*i-2, 15);
    }
    
    for(i=1; i<tempY; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    
        ctx.moveTo(-tempGridSize*i+0.5, -3);
        ctx.lineTo(-tempGridSize*i+0.5, 3);
        ctx.stroke();
    
        ctx.font = '9px Arial';
        ctx.textAlign = 'end';
        ctx.fillText(-x_axis_starting_point.number*i + x_axis_starting_point.suffix, -tempGridSize*i+3, 15);
    }
    

    for(i=1; i<(num_lines_x - tempX); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    
        ctx.moveTo(-3, tempGridSize*i+0.5);
        ctx.lineTo(3, tempGridSize*i+0.5);
        ctx.stroke();
    
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, tempGridSize*i+3);
    }
    

    for(i=1; i<tempX; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
    
        ctx.moveTo(-3, -tempGridSize*i+0.5);
        ctx.lineTo(3, -tempGridSize*i+0.5);
        ctx.stroke();
    
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, -tempGridSize*i+3);
    }
}
    let coords = {x:hexagonParts[0] , y: hexagonParts[6]};
   /* setInterval(draw, 60);
    function draw(){
        if(i < 2500){
            drawPoligon(i);
            drawHexagon(center[0],center[1]);
            rotateHexagon(coords);
            i++;
        }
    }*/
    let increase = true;
    function rotateHexagon(rotatingPoint, rotatingKoeficient){
        let startingMatrix = [
            [hexagonParts[0],hexagonParts[6],1],
            [hexagonParts[1],hexagonParts[7],1],
            [hexagonParts[2],hexagonParts[8],1],
            [hexagonParts[3],hexagonParts[9],1],
            [hexagonParts[4],hexagonParts[10],1],
            [hexagonParts[5],hexagonParts[11],1],
        ];
        let rotatingSystemMatrix = [
            [1,0,0],
            [0,1,0],
            [-1*rotatingPoint.x,-1*rotatingPoint.y,1]
        ];
        let rotatingMatrix = [
            [Math.cos(0.1), Math.sin(0.1),0],
            [-Math.sin(0.1), Math.cos(0.1),0],
            [0,0,1]
        ];
        let rotatingSystemBackMatrix = [
            [1,0,0],
            [0,1,0],
            [rotatingPoint.x,rotatingPoint.y,1]
        ];
        let koeficient = 1.05;
        let length = Math.sqrt(Math.pow((hexagonParts[1] - hexagonParts[0]),2) + Math.pow((hexagonParts[7] - hexagonParts[6]),2));
        if(length > r*rotatingKoeficient){
            increase = false;
        }
        if(length <= r){
            increase = true;
        }
        if(!increase){
            koeficient = 1/koeficient;
        }
        let increasingMatrix = [
            [koeficient,0,0],
            [0,koeficient,0],
            [0,0,1]
        ];
        let res = multiply(startingMatrix,rotatingSystemMatrix);
        res = multiply(res,rotatingMatrix);
        if(rotatingKoeficient !==1){
            res = multiply(res,increasingMatrix);
        }
        res = multiply(res,rotatingSystemBackMatrix);
        // let res = multiply(rotatingSystemMatrix, rotatingMatrix);
        // if(rotatingKoeficient !==1){
        //     res = multiply(res,increasingMatrix);
        // }
        // res = multiply(res,rotatingSystemBackMatrix);
        // res = multiply(startingMatrix,res);
        res.forEach((point,index,array) => {
            hexagonParts[index] = point[0];
            hexagonParts[index + 6] = point[1];
        });
    }
    function multiply(a, b) {
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  
        for (var r = 0; r < aNumRows; ++r) {
          m[r] = new Array(bNumCols); 
          for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;          
            for (var i = 0; i < aNumCols; ++i) {
              m[r][c] += a[r][i] * b[i][c];
            }
          }
        }
        return m;
      }

      download_img = function(el) {
        var image = canvas.toDataURL("image/jpg");
        el.href = image;
      };

