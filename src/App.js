import React, { useState, useEffect } from 'react';

const RADIUS = 0.005 // 半径5m以内

const targetLocations = {
  'living': { latitude: 35.86319878235085, longitude: 139.52311961924613 },
  'room': { latitude: 35.863584709206414, longitude: 139.5229606403691 },
};

// Haversine formulaを使用して2つの座標の距離を計算
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// 度をラジアンに変換
const toRad = (value) => {
  return (value * Math.PI) / 180;
};

const App = () => {
  const [watchId, setWatchId] = useState(null);
  const [geoText, setGeoText] = useState('');
  const [alertKey, setAlertKey] = useState('')

  const test = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 2000,
    };

    const successCallback = (position) => {
      const date = new Date(position.timestamp);

      const newGeoText = `緯度:${position.coords.latitude}<br/>
                          経度:${position.coords.longitude}<br/>
                          高度:${position.coords.altitude}<br/>
                          位置精度:${position.coords.accuracy}<br/>
                          高度精度:${position.coords.altitudeAccuracy}<br/>
                          移動方向:${position.coords.heading}<br/>
                          速度:${position.coords.speed}<br/>
                          取得時刻:${date.toLocaleString()}`;

      // 各ターゲット座標との距離を計算
      const withinRadiusTargets = Object.keys(targetLocations).filter((key) => {
        const target = targetLocations[key];
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          target.latitude,
          target.longitude
        );
        return distance <= RADIUS;
      });
      
      if(withinRadiusTargets.length > 0){
        setAlertKey(withinRadiusTargets[0])
      }else{
        setAlertKey('')
      }

      setGeoText(newGeoText);
    };

    const errorCallback = (error) => {
      alert(error.message);
    };

    const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    setWatchId(id);
  };

  const clear = () => {
    navigator.geolocation.clearWatch(watchId);
    setGeoText('');
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div>
      <button onClick={test}>test</button>
      <button onClick={clear}>clear</button>
      <p color="red">{alertKey}</p>
      <p dangerouslySetInnerHTML={{__html: geoText}} />
    </div>
  );
};

export default App;
