let c = document.querySelector(".fractal-cover");
let ctx = c.getContext("2d");
c.width = 500;
c.height= 500;
c.style.width = '500px';
c.style.height = '500px';
const W = c.width;
const H = c.height;
let k = 4;

let pixelLength = 0.009;
const X0 = 250;
const Y0 = 250;
const PI4 = 0.785398163397448;
const PI3 = 1.047197551196598;
let colorSchemes = [['rgb(255, 0, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)','rgb(255, 255, 0)'],['rgb(204, 0, 0)','rgb(0, 153, 0)','rgb(204, 0, 204)','rgb(204, 204, 0)'],['rgb(0, 204, 204)','rgb(204, 0, 204)','rgb(204, 204, 0)','rgb(0, 0, 204)']];

let colors = colorSchemes[0];

function fractal3(c, steps)
{
	//Колір для поточного пікселя
	let color;
	//Перебираємо кожну точку на канвасі
	for (let i = 0; i < W; i++)
		for (let j = 0; j < H; j++)
		{
			let iterations = steps;
			//Визначаємо відповідні x та y, адже декартова система координат відрізняється від системи координат канвасу
			//X0, Y0 - власне координати початку координат, центру канвасу
			//pixelLength - розмір одного пікселя, відповідає за масштабування
			let x = (i - X0) * pixelLength;
			let y = (j - Y0) * pixelLength;
			//Кожному пікселю зображення відповідає точка на координатній площині,
			let z = math.complex(x,y);
			//Якщо точка не є (0,0), інакше - не замальовуємо її(залишаємо чорною)
			if (x || y)
			{
				do
				{
					//За допомогою рекурентної формули наближаємо дану точку до одного з коренів, критерій зупинення - кількість ітерацій, введених користувачем  
					z = math.add(math.multiply(z,0.66),math.multiply(math.divide(math.pow(z,-2),3),c));
					iterations--;
				}
				while (iterations >= 0);
				//Ділимо аргумент на Pi/3, таким чином визначаємо, в який із трьох секторів попадає дана точка
				switch (Math.trunc(math.arg(z) / PI3))
				{
					case 0:
						//Сектор 0, замальовуємо в колір[0]
						color = colors[0];
						break;
					case 1:
					case 2:
						//Сектор 1, замальовуємо в колір[1]
						color = colors[1];
						break;
					case -1:
					case -2:
						//Сектор 2, замальовуємо в колір[2]
						color = colors[2];
						break;
				}
				//На канвасі малюємо піксель в заданій точці за замальовуємо його вирахованим кольором.
				ctx.fillStyle = color;
				ctx.fillRect(i,j,1,1);
			}
		}
}
function fractal4(c, steps)
{
	let color;
	for (let i = 0; i < W; i++)
		for (let j = 0; j < H; j++)
		{
			let iterations = steps;
			let x = (i - X0) * pixelLength;
			let y = (j - Y0) * pixelLength;
			let z = math.complex(x,y);

			if (x || y)
			{
				do
				{
					z = math.add(math.multiply(z,0.66),math.multiply(math.divide(math.pow(z,-3),4),c));
					iterations--;
				}
				while (iterations >= 0);
				switch (Math.trunc(math.arg(z) / PI4))
				{
					case 0:
						color = colors[0];
						break;
					case 1:
					case 2:
						color = colors[1];
						break;
					case -3:
					case -4:
						color = colors[2];
						break;
					case -1:
					case -2:
						color = colors[3];
						break;
				}
				ctx.fillStyle = color;
				ctx.fillRect(i,j,1,1);
			}
		}
}

document.querySelector('.draw').addEventListener('click',()=>{
	let complex = math.complex(parseInt(document.querySelector('.c-real').value), 
	parseInt(document.querySelector('.c-img').value));
	let steps = parseInt(document.querySelector('.steps').value);
	k = parseInt(document.querySelector('input[name="k"]:checked').value);
	let colorSchemeIndex = parseInt(document.querySelector('#color-scheme').value);
	switch (colorSchemeIndex){
		case 1:{
			colors = colorSchemes[0];
			break;
		}
		case 2:{
			colors = colorSchemes[1];
			break;
		}
		case 3:{
			colors = colorSchemes[2];
			break;
		}
		
	}
	let load = document.createElement('span');
	load.classList.add('load-message');
	load.innerHTML = "Малюємо...";
	document.querySelector('.draw').after(load);
	if(k == 4){
		setTimeout(() => {
			fractal4(complex,steps);
		});
	} else{
		setTimeout(() => {
			fractal3(complex,steps);
		});
	}

	setTimeout(() => {
		document.querySelector('.fractal-configure').removeChild(document.querySelector('.draw').nextSibling);
	});
})


document.querySelector('.zoom-range').addEventListener('mouseup',()=>{
	let complex = math.complex(parseInt(document.querySelector('.c-real').value), 
	parseInt(document.querySelector('.c-img').value));
	let steps = parseInt(document.querySelector('.steps').value);
	let colorSchemeIndex = parseInt(document.querySelector('#color-scheme').value);
	switch (colorSchemeIndex){
		case 1:{
			colors = colorSchemes[0];
			break;
		}
		case 2:{
			colors = colorSchemes[1];
			break;
		}
		case 3:{
			colors = colorSchemes[2];
			break;
		}
		
	}
	k = parseInt(document.querySelector('input[name="k"]:checked').value);
	let load = document.createElement('span');
	load.classList.add('load-message');
	load.innerHTML = "Малюємо...";
	document.querySelector('.draw').after(load);
	let temp = parseInt(document.querySelector('.zoom-range').value);
	switch(temp){
		case 0: {
			pixelLength = 0.05;
			break;
		}
		case 25: {
			pixelLength = 0.03
			break;
		}
		case 50:{
			pixelLength = 0.01;
			break;
		}
		case 75: {
			pixelLength = 0.005;
			break;
		}
		case 100:{
			pixelLength = 0.003;
			break;
		}
	}
	if(k == 4){
		setTimeout(() => {
			fractal4(complex,steps);
		});
	} else{
		setTimeout(() => {
			fractal3(complex,steps);
		});
	}
	setTimeout(() => {
		document.querySelector('.fractal-configure').removeChild(document.querySelector('.draw').nextSibling);
	});
})

download_img = function(el) {
	var image = c.toDataURL("image/jpg");
	el.href = image;
  };