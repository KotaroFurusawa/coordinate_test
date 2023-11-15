/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import R1 from './assets/images/alert/R1.png'
import L1 from './assets/images/alert/L1.png'
import R2 from './assets/images/alert/R2.png'
import L2 from './assets/images/alert/L2.png'
import R3 from './assets/images/alert/R3.png'
import L3 from './assets/images/alert/L3.png'
import Sound from './assets/sounds/alert/alert.mp3'

const RADIUS = 0.025 // 半径25m以内

const targetLocations = {
  '1': { alert: R2,latitude: 35.0200326699999, longitude: 139.0635751 },
  '2': { alert: L2,latitude: 35.0200019199999, longitude: 139.064467049999 },
  '3': { alert: R2,latitude: 35.0207858699999, longitude: 139.064933599999 },
  '4': { alert: L2,latitude: 35.02161503, longitude: 139.065327459999 },
  '5': { alert: R2,latitude: 35.02215789, longitude: 139.06555814 },
  '6': { alert: R2,latitude: 35.02075525, longitude: 139.062844009999 },
  '7': { alert: L3,latitude: 35.02078361, longitude: 139.06200726 },
  '8': { alert: R2,latitude: 35.0206294999999, longitude: 139.06114986 },
  '9': { alert: L1,latitude: 35.02049104, longitude: 139.06032722 },
  '10': { alert: L2,latitude: 35.02083357, longitude: 139.05941469 },
  '11': { alert: R2,latitude: 35.0201963499999, longitude: 139.058519639999 },
  '12': { alert: R2,latitude: 35.0201405199999, longitude: 139.05752817 },
  '13': { alert: R2,latitude: 35.0203433599999, longitude: 139.05675854 },
  '14': { alert: L2,latitude: 35.02124577, longitude: 139.05303501 },
  '15': { alert: L2,latitude: 35.02162999, longitude: 139.05038794 },
  '16': { alert: R1,latitude: 35.02159962, longitude: 139.04956311 },
  '17': { alert: L3,latitude: 35.02133657, longitude: 139.048104459999 },
  '18': { alert: R3,latitude: 35.0207312699999, longitude: 139.047806189999 },
  '19': { alert: R1,latitude: 35.02167146, longitude: 139.04573686 },
  '20': { alert: L2,latitude: 35.0227580999999, longitude: 139.045319299999 },
  'test': { alert: L3, latitude: 35.86319878235085, longitude: 139.52311961924613 },
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
  // const [geoText, setGeoText] = useState('');
  const [isStart, setIsStart] = useState(false);
  const [alertKey, setAlertKey] = useState('');

  const [play] = useSound(Sound);

  const test = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 2000,
    };

    const successCallback = (position) => {
      // const date = new Date(position.timestamp);

      // const newGeoText = `緯度:${position.coords.latitude}<br/>
      //                     経度:${position.coords.longitude}<br/>
      //                     高度:${position.coords.altitude}<br/>
      //                     位置精度:${position.coords.accuracy}<br/>
      //                     高度精度:${position.coords.altitudeAccuracy}<br/>
      //                     移動方向:${position.coords.heading}<br/>
      //                     速度:${position.coords.speed}<br/>
      //                     取得時刻:${date.toLocaleString()}`;

      // 各ターゲット座標との距離を計算
      // 50m以内の全てのkeyを返却
      // スポット間が最短でも70m離れているので25mのセルが干渉することはない。よって、一つしか取れない想定
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
        if(alertKey!==withinRadiusTargets[0]){
          setAlertKey(withinRadiusTargets[0])
          play()
        }
      }else{
        setAlertKey('')
      }

      // setGeoText(newGeoText);
    };

    const errorCallback = (error) => {
      alert(error.message);
    };

    const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options);
    setWatchId(id);
    setIsStart(true)
  };

  const clear = () => {
    navigator.geolocation.clearWatch(watchId);
    setIsStart(false)
    // setGeoText('');
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div css={displayCenterStyle}>
      <div css={containerStyle}>
        {alertKey && <img src={targetLocations[alertKey].alert} alt="警告"/>}
        <div css={css({display: 'flex', justifyContent: 'center'})}>
          <img src={R1} alt="警告" css={imgStyle}/>
        </div>
        <div css={css({display: 'flex', gap: 8})}>
          <button onClick={test}>開始</button>
          <button onClick={clear}>クリア</button>
          <button onClick={() => play()}>警告音テスト</button>
        </div>
        {!isStart ? <p css={css({color: 'white', lineHeight: 1.8})}>「開始」ボタンを押すと、デモが開始されます。<br/>「警告音テスト」を押して、デモ開始前に音が鳴ることをご確認ください。</p> : <p css={css({color: 'white', lineHeight: 1.8})}>デモを実行中です。「クリア」ボタンでリセットできます。</p>}
        {/* <p color="red">{alertKey}</p> */}
        {/* <p dangerouslySetInnerHTML={{__html: geoText}} /> */}
      </div>
    </div>
  );
};

const displayCenterStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px'
})

const containerStyle = css({
  width: '100%',
  maxWidth: 500
})

const imgStyle = css({
  width: '85%',
  margin: '32px 0px'
})

export default App;
