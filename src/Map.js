import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

const MapWithCurrentLocation = ({ position, height }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', { dragging: false }).setView(position, 20);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;

      const customIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
      });

      markerRef.current = L.marker(position, { icon: customIcon }).addTo(map);
    }
  }, [position]);

  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng(position);
      mapRef.current.setView(position);
    }
  }, [position]);

  return <div id="map" style={{ height }}></div>;
};

export default MapWithCurrentLocation;
