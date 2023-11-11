import React, { useState, useEffect } from 'react';

const App = () => {
  const [watchId, setWatchId] = useState(null);
  const [geoText, setGeoText] = useState('');
  const [isWatching, setIsWatching] = useState(true);

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
      <p dangerouslySetInnerHTML={{__html: geoText}} />
    </div>
  );
};

export default App;
