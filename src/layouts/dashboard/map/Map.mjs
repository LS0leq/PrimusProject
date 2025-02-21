import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import {Button} from "../../../components/buttons/Button.mjs";

export const Map = new CjsComponent((data) => {
    return `
        <div class="map">
            <div id="map" style="height: ${window.innerHeight - 65}px;"></div>
        </div>
    `;
});

Map.onLoad(() => {
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    initializeMap(latitude, longitude);
                },
                () => {
                    initializeMap(52.2298, 21.0118);
                }
            );
        } else {
            initializeMap(52.2298, 21.0118);
        }
    };

    const initializeMap = (lat, lng) => {
        const map = L.map('map').setView([lat, lng], 13);

        L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`, {
            attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
        }).addTo(map);

        const customIcon = L.icon({
            iconUrl: svg('map/marker'),
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -35]
        });

        let stations = JSON.parse(localStorage.getItem('stations')) || [];

        const createPopup = (station) => {
            return `
                <div class="station-popup">
                    <h3>${station.name}</h3>
                    <img src="${station.image}" alt="${station.name}" class="station-image"/>
                    ${EditButton.render({
                click: () => openEditForm(station.id)
            })}
                </div>
            `;
        };

        stations.forEach(function(station) {
            const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map);
            marker.on('click', function () {
                marker.bindPopup(createPopup(station)).openPopup();
            });
        });

        map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            const images = [
                "/src/assets/images/map/map1.jpg",
                "/src/assets/images/map/map2.jpg",
                "/src/assets/images/map/map3.jpg",
                "/src/assets/images/map/map4.jpg",
                "/src/assets/images/map/map5.jpg",
                "/src/assets/images/map/map6.jpg",
                "/src/assets/images/map/map7.jpg",
                "/src/assets/images/map/map8.jpg"
            ];

            const randomImage = images[Math.floor(Math.random() * images.length)];

            const newStation = {
                id: stations.length + 1,
                lat: lat,
                lng: lng,
                name: "Nowa Stacja",
                image: randomImage
            };

            stations.push(newStation);

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
            marker.bindPopup(createPopup(newStation)).openPopup();

            localStorage.setItem('stations', JSON.stringify(stations));
        });

        window.openEditForm = (id) => {
            const station = stations.find(station => station.id === id);
            if (station) {
                const editFormHtml = `
                    <div class="edit-form">
                        <h3>Edytuj stację: ${station.name}</h3>
                        <label for="name-${station.id}">Nazwa:</label>
                        <input type="text" id="name-${station.id}" value="${station.name}">
                        
                        <label for="image-${station.id}">Obrazek (Wybierz plik):</label>
                        <input type="file" id="image-${station.id}" accept="image/*">
                        <div id="image-preview-${station.id}" class="image-preview">
                            <img src="${station.image}" alt="Wybierz obrazek" style="max-width: 100px;"/>
                        </div>
                        
                        ${Button.render({
                    text: "Zapisz",
                    click: () => {
                        const newName = document.getElementById(`name-${station.id}`).value;
                        const newImageFile = document.getElementById(`image-${station.id}`).files[0];

                        if (newName && newImageFile) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                station.name = newName;
                                station.image = e.target.result;

                                localStorage.setItem('stations', JSON.stringify(stations));
                                location.reload();
                            };
                            reader.readAsDataURL(newImageFile);
                        } else if (newName) {
                            station.name = newName;
                            localStorage.setItem('stations', JSON.stringify(stations));
                            location.reload();
                        }
                    }
                })}
                        
                        ${DeleteButton.render({
                    click: () => {
                        const editForm = document.querySelector('.edit-form');
                        if (editForm) {
                            editForm.remove();
                        }
                    }
                })}
                    </div>
                `;

                const mapContainer = document.querySelector('.map');
                mapContainer.insertAdjacentHTML('beforeend', editFormHtml);

                const fileInput = document.getElementById(`image-${station.id}`);
                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const imagePreview = document.getElementById(`image-preview-${station.id}`);
                            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Podgląd obrazu" style="max-width: 100px;"/>`;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        };
    };

    getLocation();
});

Map.importStyle('./src/layouts/dashboard/map/_styles/Map.css');
