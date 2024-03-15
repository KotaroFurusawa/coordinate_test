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
import 'leaflet/dist/leaflet.css';
import MapWithCurrentLocation from './Map';
import Leaflet from 'leaflet'
import axios from 'axios';

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/'

const RADIUS = 0.025 // 半径25m以内

// const targetLocations = {
//   '1': { alert: R2,latitude: 35.0200326699999, longitude: 139.0635751 },
//   '2': { alert: L2,latitude: 35.0200019199999, longitude: 139.064467049999 },
//   '3': { alert: R2,latitude: 35.0207858699999, longitude: 139.064933599999 },
//   '4': { alert: L2,latitude: 35.02161503, longitude: 139.065327459999 },
//   '5': { alert: R2,latitude: 35.02215789, longitude: 139.06555814 },
//   '6': { alert: R2,latitude: 35.02075525, longitude: 139.062844009999 },
//   '7': { alert: L3,latitude: 35.02078361, longitude: 139.06200726 },
//   '8': { alert: R2,latitude: 35.0206294999999, longitude: 139.06114986 },
//   '9': { alert: L1,latitude: 35.02049104, longitude: 139.06032722 },
//   '10': { alert: L2,latitude: 35.02083357, longitude: 139.05941469 },
//   '11': { alert: R2,latitude: 35.0201963499999, longitude: 139.058519639999 },
//   '12': { alert: R2,latitude: 35.0201405199999, longitude: 139.05752817 },
//   '13': { alert: R2,latitude: 35.0203433599999, longitude: 139.05675854 },
//   '14': { alert: L2,latitude: 35.02124577, longitude: 139.05303501 },
//   '15': { alert: L2,latitude: 35.02162999, longitude: 139.05038794 },
//   '16': { alert: R1,latitude: 35.02159962, longitude: 139.04956311 },
//   '17': { alert: L3,latitude: 35.02133657, longitude: 139.048104459999 },
//   '18': { alert: R3,latitude: 35.0207312699999, longitude: 139.047806189999 },
//   '19': { alert: R1,latitude: 35.02167146, longitude: 139.04573686 },
//   '20': { alert: L2,latitude: 35.0227580999999, longitude: 139.045319299999 },
//   'test1': { alert: L2, latitude: 35.861358, longitude: 139.514255 },
//   'test2': { alert: L2, latitude: 35.857980, longitude: 139.516098 },
//   'test3': { alert: L2, latitude: 35.859108, longitude: 139.519107 },
//   '101': { alert: L2, latitude: 35.60301354, longitude: 139.5035557 },
//   '102': { alert: R3, latitude: 35.60168764, longitude: 139.5040731 },
//   '103': { alert: R1, latitude: 35.62497077, longitude: 139.514726 },
//   '104': { alert: R2, latitude: 35.62555442, longitude: 139.5145345 },
//   '105': { alert: R3, latitude: 35.62617419, longitude: 139.5133445 },
//   '106': { alert: L2, latitude: 35.62687008, longitude: 139.51346 },
//   '107': { alert: L1, latitude: 35.62931304, longitude: 139.5129325 },
//   '108': { alert: L3, latitude: 35.6303786, longitude: 139.5113118 },
//   '109': { alert: L1, latitude: 35.6284409, longitude: 139.5113816 },
//   '110': { alert: L1, latitude: 35.62915916, longitude: 139.5151191 },
//   '111': { alert: R1, latitude: 35.63134247, longitude: 139.5147054 }
// };

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
  const [currentPosition, setCurrentPosition] = useState([0,0])
  const [targetLocations, setTargetLocations] = useState({})
  const [direction, setDirection] = useState("up");

  const changeDirection = (event) => setDirection(event.target.value);

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
      setCurrentPosition([position.coords.latitude, position.coords.longitude])
      
      const withinRadiusTargets = Object.keys(targetLocations).filter((key)=>{
        const target = targetLocations[key];
        if(direction==='up'){
          return target.alertUp !== null
        }
        return target.alertDown !== null
      }).filter((key) => {
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
        setAlertKey(prevAlertKey => {
          if (prevAlertKey !== withinRadiusTargets[0]) {
            play();
            return withinRadiusTargets[0];
          }
          return prevAlertKey;
        });
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
    setAlertKey('')
    setIsStart(false)
    // setGeoText('');
  };

  const alertTextToImage = (alertText) => {
    switch (alertText) {
      case 'R1':
        return R1
      case 'R2':
        return R2
      case 'R3':
        return R3
      case 'L1':
        return L1
      case 'L2':
        return L2
      case 'L3':
        return L3
      default:
        return null
    }
  }

  useEffect(() => {
    const fetchTargetLocations = async () => {
      const {data} = await axios.get('https://sheets.googleapis.com/v4/spreadsheets/17YrxmwO1tdZ_3FvBYbvxm7If6pkSvNFsL2YXME7Zg6o/values/sheet1!B4:E300?key=AIzaSyDnrOf_0rTGU98l5aq45r74Z4nu7XsfIno')
      const locations = await data.values?.map((value)=>({latitude: Number(value[0]), longitude: Number(value[1]), alertUp: alertTextToImage(value[2]), alertDown: alertTextToImage(value[3])}))
      setTargetLocations(Object.assign({}, locations))
    }

    fetchTargetLocations()

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div css={displayCenterStyle}>
      <div css={containerStyle}>
        <div css={css({margin: 16, height: 246})}>
          <div css={css({display: 'flex', gap: 8, justifyContent: 'center'})}>
            {isStart ? <button onClick={clear}>クリア</button> : <button onClick={test}>開始</button>}
            <button onClick={() => play()}>警告音テスト</button>
            {/* <button onClick={() => setAlertKey('test1')}>表示テスト</button>
            <button onClick={() => setAlertKey('')}>非表示テスト</button> */}
          </div>
          {!isStart && <div css={css({margin: 16, display: 'flex', justifyContent: 'center', gap: 16,color: 'white', lineHeight: 1.8,})}>
              <span>
                <input id="up" type="radio" name="direction" value="up" onChange={changeDirection} checked={direction==='up'}/>
                <label htmlFor="up">
                    上り
                </label>
              </span>
              <span>
                <input id="down" type="radio" name="direction" value="down" onChange={changeDirection} checked={direction==='down'}/>
                <label htmlFor="down">
                    下り
                </label>
              </span>
            </div>}
          {!isStart && <p css={css({color: 'white', lineHeight: 1.8, marginTop: 12})}>上り / 下りを選択して「開始」ボタンを押すと、デモが開始されます。<br/>
          開始前に、以下の点についてご確認ください。<br/>
          1. 「警告音テスト」を押して、デモ開始前に音が鳴ることをご確認ください。(音量が0、またはマナーモードになっていると音が鳴りません)<br/>
          2. ご使用中のブラウザに、位置情報の利用を許可してください<br/>
          3. ご使用中の端末の画面自動ロックをオフにしてください。
          </p>}
          <div css={css({display: 'flex', justifyContent: 'center', marginTop: 16})}>
            {alertKey && <img src={direction === 'up' ? targetLocations[alertKey].alertUp : targetLocations[alertKey].alertDown} alt="警告" css={imgStyle}/>}
            {/* <img src={R2} alt="警告" css={imgStyle}/> */}
          </div>
        </div>
        {
          isStart && <MapWithCurrentLocation position={currentPosition} height="50vh"/>
        }
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
})

const containerStyle = css({
  width: '100%',
  maxWidth: 500,
})

const imgStyle = css({
  width: '180px',
})


export default App;
