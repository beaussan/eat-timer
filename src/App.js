import React, { useEffect, useState } from 'react';
import './styles.css';
import { useTimer } from 'react-timer-hook';
import { addSeconds } from 'date-fns/fp';
import useSound from 'use-sound';
import eatSound from './eat.mp3';
import Confetti from 'react-dom-confetti';
import { useLocalStorage } from './useLocalStorage';

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: '2',
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
};

function MyTimer({ expiryTimestamp, interval }) {
  const addTime = addSeconds(interval + 1);
  const [playSond] = useSound(eatSound, { volume: 1 });
  const [alreadyStartedOnce, setAlreadyStartedOnce] = useState(false);
  const { seconds, isRunning, restart } = useTimer({
    expiryTimestamp
  });

  useEffect(() => {
    if (alreadyStartedOnce && !isRunning && seconds === 0) {
      playSond();
    }
  }, [alreadyStartedOnce, isRunning, seconds, playSond]);

  const startTimer = () => {
    if (isRunning) {
      return;
    }
    restart(addTime(new Date()));
    setTimeout(() => {
      setAlreadyStartedOnce(true);
    }, 300);
  };

  return (
    <div
      className="flex flex-col  items-center justify-center h-screen w-screen cursor-pointer"
      onClick={startTimer}
    >
      <Confetti active={!isRunning && alreadyStartedOnce} config={config} />
      {isRunning && (
        <div style={{ fontSize: '100px' }}>
          <span/>
        </div>
      )}

      <div className="h-16">
        {!isRunning ? (
          <button className="py-2 px-4 bg-green-300 rounded-lg text-green-800">
            Dis moi quand je peux manger !
          </button>
        ) : (
          <span> </span>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(undefined);
  const [itm, setItm] = useState(0);
  const [oldItems, setOldItems] = useLocalStorage('oldEntries', []);
  const setUserValue = (val) => {
    if (val <= 0) {
      return;
    }
    const newOld = [
      ...new Set(
        [...oldItems, val].sort(function (a, b) {
          return a - b;
        })
      )
    ];
    setOldItems(newOld);
    setState(val);
  };
  const initTime = new Date();
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {state ? (
        <MyTimer expiryTimestamp={initTime} interval={state} />
      ) : (
        <div className="flex flex-col">
          <div className="flex ">
            <input
              value={itm}
              onChange={(event) => setItm(parseInt(event.target.value))}
              type="number"
              className="px-3 text-black rounded-lg w-20 mr-5"
            />
            <button
              className="text-black bg-blue-300 text-blue-800 rounded-lg py-2 px-4"
              onClick={() => {
                setUserValue(itm);
              }}
            >
              Commencer !
            </button>
          </div>
          <div className="flex mt-8 space-x-5">
            {oldItems.map((it) => {
              return (
                <button
                  key={it}
                  className="bg-orange-300 text-orange-800 rounded-lg py-2 px-4"
                  onClick={() => setState(it)}
                >
                  {it}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
