import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TezroMap = () => {
  return (
    <div style={{ height: '100%', width: '100%', borderRadius: '20px', overflow: 'hidden', border: '1px solid #D4AF3733' }}>
      <MapContainer center={[31.4504, 73.1350]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; Tezro Elite Systems'
        />
        <Marker position={[31.4504, 73.1350]}>
          <Popup>Tezro HQ - Faisalabad</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default TezroMap;
