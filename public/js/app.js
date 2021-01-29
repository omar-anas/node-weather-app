

const date = new Date();
var currentHour = date.getHours();



const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const icon = document.getElementById('icon');
console.log(icon.src)
const desc = document.querySelector('.today-weather h3');
const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');
const messageError = document.querySelector('#message-error');
const tempo =document.querySelector('#cityTemp');







const list1 = document.querySelector('#l1')

 const list2 = document.querySelector('#l2');

 const list3 = document.querySelector('#l3');
 const list4 = document.querySelector('#l4');
 const list5 = document.querySelector('#l5');





weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    messageOne.textContent = "Loading...";
    messageError.textContent = "";

    fetch(`/weather?address=${search.value}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {

                messageError.textContent = data.error;
            }




            else {
                
                const str = data.address;
                
                const location  = str.split(', ');
                const city = location[0];
                const country = location[location.length-1];
                messageOne.textContent =  country;
                messageTwo.textContent = city;
                

                
                tempo.innerHTML=`${data.currentTemp+'°'}<span>C</span>`

                desc.textContent = data.desc;

                icon.src = `http://openweathermap.org/img/wn/${data.icon}@4x.png`;

                


                if ((currentHour + 3) >= 10) {
                    list1.innerHTML = `Now<span>${data.currentTemp + '°C'}</span>`;
                    list3.innerText = (currentHour + 6) + ':00';
                    list4.innerText = (currentHour + 9) + ':00';
                    list5.innerText = (currentHour + 12) + ':00';
                }
                else {
                    list1.innerHTML = `Now<span>${data.currentTemp + '°C'}</span>`;
                    list2.innerHTML = `${currentHour + 3+':00'}<span>${data.temp3 + '°C'}</span>`;
                    list3.innerHTML = `${currentHour + 6+':00'}<span>${data.temp6 + '°C'}</span>`
                    list4.innerHTML = `${currentHour + 9+':00'}<span>${data.temp9 + '°C'}</span>`
                    list5.innerHTML = `${currentHour + 12+':00'}<span>${data.temp12 + '°C'}</span>`
                }

                
                
                
                


            }

        })
    })

})