import React, { useEffect, useState } from 'react';
import './styles.css';
import { useTimer } from 'react-timer-hook';
import { addSeconds } from 'date-fns/fp';
import useSound from 'use-sound';
import eatSound from './eat.mp3';
import Confetti from 'react-dom-confetti';

const SECONDS_TO_EAT = 5;

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

const addTime = addSeconds(SECONDS_TO_EAT + 1);

function MyTimer({ expiryTimestamp }) {
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

  return (
    <div className="flex flex-col  items-center justify-center">
      <Confetti active={!isRunning && alreadyStartedOnce} config={config} />
      {isRunning && (
        <div style={{ fontSize: '100px' }}>
          <span>...</span>
        </div>
      )}

      <div className="h-16">
        {!isRunning ? (
          <button
            className="py-2 px-4 bg-green-300 rounded-lg text-green-800"
            onClick={() => {
              restart(addTime(new Date()));
              setTimeout(() => {
                setAlreadyStartedOnce(true);
              }, 300);
            }}
          >
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
  const initTime = new Date();
  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      <MyTimer expiryTimestamp={initTime} />
    </div>
  );
}
