/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";

function App() {
  const [display, setDisplay] = useState(false);
  const [position, setPosition] = useState(null);
  const targetLocations = {
    'hoge': { latitude: 37.7749, longitude: -122.4194 },
    'fuga': { latitude: 37.7749, longitude: -122.4094 },
    // Add more target locations as needed
  };

  const [currentTarget, setCurrentTarget] = useState(null);

  useEffect(() => {
    const updateLocation = () => {
      // ブラウザが位置情報をサポートしているか確認
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (userPosition) => {
            // ユーザーの位置情報が取得できた場合
            setPosition(userPosition.coords);

            // 各ターゲット座標との距離を計算
            const withinRadiusTargets = Object.keys(targetLocations).filter((key) => {
              const target = targetLocations[key];
              const distance = calculateDistance(
                userPosition.coords.latitude,
                userPosition.coords.longitude,
                target.latitude,
                target.longitude
              );
              return distance <= 0.01; // 半径10m以内
            });

            // 半径10m以内の場合、アラートを表示
            if (withinRadiusTargets.length > 0) {
              setDisplay(true);
              setCurrentTarget(withinRadiusTargets[0]); // とりあえず最初の要素を表示
            }
          },
          (error) => {
            console.error("Error getting user's location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser");
      }
    };

    // 最初の位置情報を取得
    updateLocation();

    // 500msごとに位置情報を取得
    const intervalId = setInterval(updateLocation, 500);

    // コンポーネントがアンマウントされたときにクリーンアップ
    return () => clearInterval(intervalId);
  }, []); // 空の依存配列を渡すことで、初回レンダー時のみ実行される

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

  return (
    <div css={mainStyle}>
      {display && <div>アラート{currentTarget && `: ${currentTarget}`}</div>}
      {position && (
        <div>
          <p>
            緯度: {position.latitude}, 経度: {position.longitude}
          </p>
        </div>
      )}
    </div>
  );
}

const mainStyle = css({
  display: 'flex',
  justifyContent: 'center'
});

export default App;
