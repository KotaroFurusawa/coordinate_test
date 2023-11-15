import L from 'leaflet'
import { MapContainer, TileLayer, Marker} from 'react-leaflet';

// const customIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // 任意の色のアイコンURL
//   iconSize: [25, 41],
//   // iconAnchor: [12, 41],
//   // popupAnchor: [1, -34],
//   // shadowSize: [41, 41],
// });


const MapWithCurrentLocation = ({ position, height }) => {
  return (
    <MapContainer key={`${position[0]}-${position[1]}`} center={position} zoom={20} style={{ height }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {position && <Marker position={position} />}
    </MapContainer>
  );
};

export default MapWithCurrentLocation;