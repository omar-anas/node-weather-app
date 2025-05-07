const date = new Date();
const currentHour = date.getHours();

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');

const icon = document.getElementById('icon');
const desc = document.querySelector('.today-weather h3');
const messageOne = document.querySelector('#messageOne');
const messageTwo = document.querySelector('#messageTwo');
const messageError = document.querySelector('#message-error');
const tempo = document.querySelector('#cityTemp');

const list1 = document.querySelector('#l1');
const list2 = document.querySelector('#l2');
const list3 = document.querySelector('#l3');
const list4 = document.querySelector('#l4');
const list5 = document.querySelector('#l5');

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageOne.textContent = "Loading....";
    messageError.textContent = "";
    
    try {
        
        const response = await fetch(`http://localhost:3000/weather?address=${search.value.trim()}`);
        console.log(response);
        
        const data = await response.json();
        
        if (data.error) {
            messageError.textContent = data.error;
            return;
        }

        // Update location information
        const location = data.location;
        messageOne.textContent = location.country;
        messageTwo.textContent = location.name;
        
        // Update current weather
        tempo.innerHTML = `${data.current.temp}°<span>C</span>`;
        desc.textContent = data.current.weather.description;
        icon.src = data.current.weather.icon;

        // Update hourly forecasts
        const timeSlots = [
            { element: list1, label: 'Now', temp: data.current.temp },
            { element: list2, hour: (currentHour + 3) % 24, temp: data.hourly.temp3 },
            { element: list3, hour: (currentHour + 6) % 24, temp: data.hourly.temp6 },
            { element: list4, hour: (currentHour + 9) % 24, temp: data.hourly.temp9 },
            { element: list5, hour: (currentHour + 12) % 24, temp: data.hourly.temp12 }
        ];

        timeSlots.forEach(slot => {
            if (slot.label) {
                slot.element.innerHTML = `${slot.label}<span>${slot.temp}°C</span>`;
            } else {
                const hourString = slot.hour < 10 ? `0${slot.hour}:00` : `${slot.hour}:00`;
                slot.element.innerHTML = `${hourString}<span>${slot.temp}°C</span>`;
            }
        });

    } catch (error) {
        messageError.textContent = "Unable to fetch weather data. Please try again.";
    }
});