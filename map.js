function initMap() {
    const location = [-33.945094479374696, 25.57009159285859];
    const map = L.map("map").setView(location, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    L.marker(location).addTo(map).bindPopup("CTU Training Solutions, 26 Worraker St, Newton Park, Gqeberha, 6045");
}

document.addEventListener("DOMContentLoaded", function () {
    initMap(); 
});