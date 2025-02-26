import { EditButton } from "../../../components/buttons/EditButton.mjs";
import { DeleteButton } from "../../../components/buttons/DeleteButton.mjs";
import { Button } from "../../../components/buttons/Button.mjs";
import { StationsRequests } from "../../../requests/channels/StationsRequests.mjs";

export const Map = new CjsComponent(() => {
    return `
        <div class="map">
            <div id="map" style="height: ${window.innerHeight - 65}px;"></div>
        </div>
    `;
});

Map.onLoad(() => {
    const stationsRequests = new StationsRequests();

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    initializeMap(latitude, longitude);
                },
                () => {
                    initializeMap(52.2298, 21.0118); // Domyślna lokalizacja
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

        let stations = [];

        stationsRequests.getAll().then(response => {

            if (Array.isArray(response) && response.length > 0) {
                const stations = response;
                stations.forEach(station => {
                    const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map);
                    marker.on('click', function () {
                        marker.bindPopup(createPopup(station)).openPopup();
                    });
                });
            } else {
                console.warn("Brak stacji w odpowiedzi lub odpowiedź jest pusta.");
            }
        }).catch(error => {
            console.error("Błąd podczas pobierania stacji:", error);
        });




        const createPopup = (station) => {
            return `
                <div class="station-popup">
                    <h3>${station.name}</h3>
                    <img src="${station.image}" alt="${station.name}" class="station-image"/>
                    ${EditButton.render({ click: () => openEditForm(station.id) })}
                </div>
            `;
        };

        window.openEditForm = (id) => {
            const station = stations.find(station => station.id === id);
            if (!station) return;

            const editFormHtml = `
                <div class="edit-form">
                    <h3>Edytuj stację: ${station.name}</h3>
                    <label for="name-${station.id}">Nazwa:</label>
                    <input type="text" id="name-${station.id}" value="${station.name}">
                    <label for="image-${station.id}">Obrazek:</label>
                    <input type="file" id="image-${station.id}" accept="image/*">
                    <div id="image-preview-${station.id}">
                        <img src="${station.image}" alt="Podgląd obrazu" style="max-width: 100px;"/>
                    </div>
                    ${Button.render({
                text: "Zapisz",
                click: () => {
                    const newName = document.getElementById(`name-${station.id}`).value;
                    const newImageFile = document.getElementById(`image-${station.id}`).files[0];

                    const updatedStation = { name: newName };

                    if (newImageFile) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            updatedStation.image = e.target.result;
                            stationsRequests.update(station.id, updatedStation).then(response => {
                                if (response) {
                                    station.name = newName;
                                    station.image = e.target.result;
                                    location.reload();
                                }
                            });
                        };
                        reader.readAsDataURL(newImageFile);
                    } else {
                        stationsRequests.update(station.id, updatedStation).then(response => {
                            if (response) {
                                station.name = newName;
                                location.reload();
                            }
                        });
                    }
                }
            })}
                    ${DeleteButton.render({
                click: () => {
                    stationsRequests.delete(station.id).then(response => {
                        if (response) {
                            stations = stations.filter(st => st.id !== station.id);
                            location.reload();
                        }
                    });
                }
            })}
                </div>
            `;

            document.querySelector('.map').insertAdjacentHTML('beforeend', editFormHtml);
        };
    };

    getLocation();
});

Map.importStyle('./src/layouts/dashboard/map/_styles/Map.css');
