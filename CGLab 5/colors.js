const canvas = document.querySelector('#original-image');
const ctx = canvas.getContext("2d");
const degrees60 = 60;
const degrees360 = 360;
const degrees120 = 120;
const degrees240 = 240;


const calculateH = function(r, g, b, maxNumber, minNumber) {
    let h = undefined;

    if(maxNumber === minNumber) {
        return h;
    }
    else if( maxNumber === r && g >= b)
    {
        h = degrees60 * (g - b) / (maxNumber - minNumber);
    }
    else if( maxNumber === r && g < b)
    {
        h = degrees60 * (g - b) / (maxNumber - minNumber) + degrees360;
    }
    else if( maxNumber === g)
    {
        h = degrees60 * (b - r) / (maxNumber - minNumber) + degrees120;
    }
    else if( maxNumber === b)
    {

        h = degrees60 * (r - g) / (maxNumber - minNumber) + degrees240;
    }

    return h;
}

const calculateL = function(maxNumber, minNumber) {
    return (maxNumber + minNumber) / 2;
}

const calculateS = function(l, maxNumber, minNumber) {
    
    let s = 0;

    if((l > -0.000005 && l <0.000005) || maxNumber === minNumber ) {
        s = 0;
    }
    else if(0 < l && l <= 1/2) {
        s = (maxNumber - minNumber) / (maxNumber + minNumber);
    }
    else if(l > 1/2){
        s = (maxNumber - minNumber) / (2 - (maxNumber + minNumber))
    }

    return s;
}


const convertRGBintoHSL = function(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const maxNumber = Math.max(r, g, b);
    const minNumber = Math.min(r, g, b);

    const h = calculateH(r, g, b, maxNumber, minNumber);
    const l = calculateL(maxNumber, minNumber);
    const s = calculateS(l, maxNumber, minNumber);
    
    return [h, s, l];
}

const calculateC = function(l, s) {
    return (1 - Math.abs((2 * l - 1))) * s;
}

const calculateHs = function(h) {
    return h / degrees60;
}

const calculateX = function(c, hs) {
    return c * (1 - Math.abs(hs % 2 - 1));
}

const calculateM = function(l, c) {
    return l - c / 2;
}

const convertHSLintoRGB = function(h, s, l) {
    
    const c = calculateC(l, s);
    const hs = calculateHs(h);
    const x = calculateX(c, hs);
    const m = calculateM(l, c);
    let rgbInter = [0, 0, 0];    
    if(h === undefined) {
        rgbInter = [0, 0, 0];
    }
    else if(hs >= 0 && hs < 1) {
        rgbInter = [c, x, 0];
    }
    else if(hs >= 1 && hs < 2){
        rgbInter = [x, c, 0];
    }
    else if(hs >= 2 && hs < 3) {
        rgbInter = [0, c, x];
    }
    else if(hs >= 3 && hs < 4) {
        rgbInter = [0, x, c];
    }
    else if(hs >= 4 && hs < 5) {
        rgbInter = [x, 0, c];
    }
    else if(hs >= 5 && hs < 6) {
        rgbInter = [c, 0, x];
    }
    return [
        (rgbInter[0] + m) * 255, 
        (rgbInter[1] + m) * 255,
        (rgbInter[2] + m) * 255,
    ]
}
     

document.querySelector('#image').addEventListener('change', (event)=>{
    const img = new Image();

    img.src = './images/color_samples/' + event.target.files[0].name;

    img.onload = () => {
        canvas.height = 480;
        canvas.width = 480;
        ctx.drawImage(img, 0, 0, img.width,    img.height,   
                   0, 0, canvas.width, canvas.height);
        drawSecondCanvas();
        canvas2.addEventListener("mousemove", (event) => pick(event, hoveredColor));
    };
});

const hoveredColor = document.querySelector(".hovered-color");
const canvas2 = document.querySelector('#modified-image');
const ctx2 = canvas2.getContext("2d");


function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

}
let x1=0,y1=0,x2=0,y2=0;
let highlightedRectangle;
canvas2.addEventListener('mousedown',(event)=>{
    let rect = canvas2.getBoundingClientRect();
     x1 = event.clientX - rect.left;
     y1 = event.clientY - rect.top;

})
canvas2.addEventListener('mouseup',(event)=>{
    let rect = canvas2.getBoundingClientRect();
    x2 = event.clientX - rect.left;
    y2 = event.clientY - rect.top;
    let length = x2 - x1;
    let height = y2 - y1; 

    highlightedRectangle = ctx.getImageData(
        x1,
        y1,
        length,
        height,
    );


});
function drawSecondCanvas(){
    let imgData = ctx.getImageData(
        0,
        0,
        canvas.width ,
        canvas.height 
    )
    canvas2.width = 480;
    canvas2.height = 480;
    for(let i=0;i<imgData.data.length;i+=4){
        let [r,g,b] = [imgData.data[i] , imgData.data[i + 1], imgData.data[i + 2]]

        let [h,s,l] = convertRGBintoHSL(r,g,b);
        
        [r,g,b] = convertHSLintoRGB(h,s,l);

        imgData.data[i] = r;
        imgData.data[i+1] =g;
        imgData.data[i+2] = b;
    }


    ctx2.putImageData(imgData,0,0);
}

document.querySelectorAll('.square').forEach(square=>{
    square.addEventListener('click',(event)=>{
        let activeSquare = document.querySelector('[data-active]');
        if(event.target == activeSquare){
            return;
        }
        delete activeSquare.dataset.active;
        event.target.dataset.active = true;
    })
})
function checkBrightnessLimits(newBrightness){
    if(newBrightness > 1){
        return 1;
    } 
    if(newBrightness < 0){
        return 0;
    }
    return newBrightness;
}
document.querySelector('#mode').addEventListener('change',()=>{
    ctx2.putImageData(ctx.getImageData(0,0,canvas.width, canvas.height ),0,0);
    document.querySelector('.brightness-range').value = 0;
})

document.querySelector('.brightness-range').addEventListener('mouseup',()=>{
	let mode = parseInt(document.querySelector('#mode').value);
    if(mode == 1){
        if(highlightedRectangle!==undefined){
            
            let newBrightness = parseInt(document.querySelector('.brightness-range').value);
            newBrightness/=100;
            let temp = structuredClone(highlightedRectangle);
            for(let i=0;i<highlightedRectangle.data.length;i+=4){
                let [r,g,b] = [highlightedRectangle.data[i] , highlightedRectangle.data[i + 1], highlightedRectangle.data[i + 2]]
                let [h,s,l] = convertRGBintoHSL(r,g,b);
                [r,g,b] = convertHSLintoRGB(h,s,checkBrightnessLimits(newBrightness + l));
               temp.data[i] = r
               temp.data[i+1] =g
               temp.data[i+2] = b
            }
            ctx2.putImageData(temp,x1,y1);
        }
    } else{
        let activeColor = document.querySelector('[data-active]').dataset.color_changer;
        let newBrightness = parseInt(document.querySelector('.brightness-range').value);
        newBrightness/=100;
        let imgData = ctx.getImageData(
            0,
            0,
            canvas.width ,
            canvas.height 
        )
        for(let i=0;i<imgData.data.length;i+=4){
            let [r,g,b] = [imgData.data[i] , imgData.data[i + 1], imgData.data[i + 2]]
            let [h,s,l] = convertRGBintoHSL(r,g,b);
    
            [h,s,l] = changeBrightnessOfSelectedColor([h,s,l], checkBrightnessLimits(newBrightness + l) ,activeColor);
            [r,g,b] = convertHSLintoRGB(h,s,l);
           imgData.data[i] = r
           imgData.data[i+1] =g
           imgData.data[i+2] = b
        }
        ctx2.putImageData(imgData,0,0);
    }
    
})



const changeBrightnessOfSelectedColor = function([h, s, l], newBrightness, selectedColor) {
    switch (selectedColor) {
        case "red":
            if((h <= 20 && h >= 0) || (h <= 360 && h >= 340)) {
                return [h, s, newBrightness]
            }
            break;
        case "green":
            if(h <= 140 && h >= 100) {
                return [h, s, newBrightness]
            }
            break;
        case "blue":
            if(h <= 260 && h >= 220) {
                return [h, s, newBrightness]
            }
            break;
        case "cyan":
            if(h <= 200 && h >= 160) {
                return [h, s, newBrightness]
            }
            break;
        case "magenta":
            if(h <= 320 && h >= 280) {
                return [h, s, newBrightness]
            }
            break;
        case "yellow":
            if(h <= 80 && h >= 40) {
                return [h, s, newBrightness]
            }
            break;
    }
    return [h, s, l];
}


function pick(event, destination) {
    const bounding = canvas2.getBoundingClientRect();
    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;
    const pixel = ctx2.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    destination.style.background = rgb;
    let hsl = convertRGBintoHSL(data[0],data[1],data[2]);
    document.querySelector('.rgb').innerHTML = rgb;
    document.querySelector('.hsl').innerHTML = `hsl(${Math.round(hsl[0]==undefined?0:hsl[0])}°,${Math.round(hsl[1]*100)}%,${Math.round(hsl[2]*100)}%)`  
    return rgb;
  }
  
  //canvas2.addEventListener('click', event => pick(event, selectedColor));

  download_img = function(el) {
	var image = canvas2.toDataURL("image/jpg");
	el.href = image;
  };