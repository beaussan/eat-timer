import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';

const canWakeLock = () => 'wakeLock' in navigator;

let wakelock;
async function lockWakeState() {
  if (!canWakeLock()) return;
  try {
    // @ts-expect-error we should get this out of the box
    wakelock = await navigator?.wakeLock?.request();
    wakelock.addEventListener('release', () => {
      console.log('Screen Wake State Locked:', !wakelock.released);
    });
    console.log('Screen Wake State Locked:', !wakelock.released);
  } catch (e) {
    alert('Failed to lock wake state with reason:' + e.message);
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <div className="w-screen h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      <App />
    </div>
  </React.StrictMode>,
  rootElement
);

lockWakeState();
