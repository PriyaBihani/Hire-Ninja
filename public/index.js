let mymap, marker, lat, lon;
console.log(test);
//locate button
document.getElementById('geolocate').addEventListener('click', () => {
   // geolocate
   if ('geolocation' in navigator) {
      console.log('available');
      createMap();
      navigator.geolocation.getCurrentPosition(async (position) => {
         try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(lat, lon);
            createMarker(lat, lon);
         } catch {
            console.log('error');
         }
      });
   } else {
      console.log(' NOt avialable');
   }
});
document.getElementById('ninjaList').addEventListener('click', async () => {
   console.log('clicked');
   await ninjaMap();
});

async function ninjaMap() {
   const response = await fetch(`/book/ninjaList?lat=${lat}&lon=${lon}`);
   const ninjas = await response.json();
   console.log(ninjas);

   // create map functions

   ninjas.forEach((ninja) => {
      const latitude = ninja.geometry.coordinates[0];
      const longitude = ninja.geometry.coordinates[0];
      createMarker(latitude, longitude);
   });

   showNinjas(ninjas);
}

const showNinjas = (ninjas) => {
   console.log(ninjas);
   const showNinjas = document.querySelector('#showNinjaList');

   let html = '';
   ninjas.forEach((ninja) => {
      const data = `
            <div> 
              <span> Ninja Name : ${ninja.name} </span> 
              <span> Ninja rank : ${ninja.rank}</span> 
              <a href="/book/details/${ninja.id}"> Details</a>
            </div>
        `;
      html += data;
   });

   showNinjas.innerHTML = html;
};
function createMarker(lat, lon) {
   marker = L.marker([lat, lon]).addTo(mymap);
}
function createMap() {
   mymap = L.map('map').setView([0, 0], 1);
   L.tileLayer(
      'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
         attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
         maxZoom: 18,
         id: 'mapbox.streets',
         accessToken: process.env.ACCESS_TOKEN,
      }
   ).addTo(mymap);
}
