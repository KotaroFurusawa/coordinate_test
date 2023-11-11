import React, { useState, useEffect, useRef } from 'react';

const ErrorText = () => (
  <p className="App-error-text">geolocation IS NOT available</p>
);

const App = () => {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [watchStatus, setWatchStatus] = useState({
    isWatching: false,
    watchId: null
  });

  // useEffectが実行されているかどうかを判定するために用意しています
  const isFirstRef = useRef(true);

  useEffect(() => {
    isFirstRef.current = false;
    if ('geolocation' in navigator) {
      setAvailable(true);
    }
  }, [isAvailable]);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
  };

  /*
   * 監視を開始します
   */
  const startWatchPosition = () => {
    const watchId = navigator.geolocation.watchPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });

    setWatchStatus({ isWatching: true, watchId });
  };

  /*
   * 監視を停止します
   */
  const stopWatchPosition = watchStatus => {
    navigator.geolocation.clearWatch(watchId);
    setWatchStatus({ isWatching: false, watchId });
  };

  // useEffect実行前であれば、"Loading..."という呼び出しを表示させます
  if (isFirstRef.current) return <div className="App">Loading...</div>;

  const { isWatching, watchId } = watchStatus;

  return (
    <div className="App">
      <h2>Geolocation API Sample</h2>
      {!isFirstRef && !isAvailable && <ErrorText />}
      {isAvailable && (
        <div>
          <button onClick={getCurrentPosition}>Get Current Position</button>
          {isWatching ? (
            <button onClick={() => stopWatchPosition(watchStatus)}>
              Stop Watch Position
            </button>
          ) : (
            <button onClick={startWatchPosition}>Start Watch Position</button>
          )}
          <div>
            <h3>Position</h3>
            <div>
              latitude: {position.latitude}
              <br />
              longitude: {position.longitude}
            </div>
          </div>
          <div>
            <h3>Watch Mode</h3>
            <p>Watch Status: {isWatching ? 'Watching' : 'Not Watching'}</p>
            <p>Watch ID: {watchId}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App