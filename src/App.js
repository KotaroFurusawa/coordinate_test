import React, { useState, useEffect } from 'react';

const App = () => {
  const [num, setNum] = useState(0);
  const [watchId, setWatchId] = useState(null);
  const [geoText, setGeoText] = useState('');

  const test = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 2000,
    };

    const successCallback = (position) => {
      const date = new Date(position.timestamp);

      const newGeoText = `緯度:${position.coords.latitude}\n
                          経度:${position.coords.longitude}\n
                          高度:${position.coords.altitude}\n
                          位置精度:${position.coords.accuracy}\n
                          高度精度:${position.coords.altitudeAccuracy}\n
                          移動方向:${position.coords.heading}\n
                          速度:${position.coords.speed}\n
                          取得時刻:${date.toLocaleString()}\n
                          取得回数:${num + 1}\n`;

      setGeoText(newGeoText);
      setNum((prevNum) => prevNum + 1);
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
    setNum(0);
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

      <pre id="position_view">{geoText}</pre>
    </div>
  );
};

export default App;
