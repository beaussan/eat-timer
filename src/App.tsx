import React, { useState } from 'react';
import './styles.css';
// We need to import it staticaly because the dynamic import dosn't work for some reason
// And I don't have time to debug it anyway
import 'howler';
import useSound from 'use-sound';
import eatSound from './eat.mp3';
import Confetti, { ConfettiConfig } from 'react-dom-confetti';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const config: ConfettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 2,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

interface TimerContext {
  count: number;
  delay: number;
}

type ToggleEvents = { type: 'TRIGGER' } | { type: 'SET_DELAY'; delay: number };

const toggleMachine = createMachine<TimerContext, ToggleEvents>(
  {
    id: 'timer',
    initial: 'inactive',
    context: {
      count: 0,
      delay: 1000,
    },
    states: {
      inactive: {
        on: {
          SET_DELAY: {
            target: 'ready',

            actions: assign({
              delay: (ctx, event) => {
                console.log('ACTION SET HERE', ctx, event, event.delay);
                return event.delay;
              },
            }),
          },
        },
      },
      ready: {
        invoke: [
          {
            src: 'playSound',
          },
        ],
        on: {
          TRIGGER: {
            target: 'running',
            actions: assign({
              count: (ctx) => ctx.count + 1,
            }),
          },
        },
      },
      running: {
        after: {
          DYNAMIC_DELAY: { target: 'ready' },
        },
      },
    },
    predictableActionArguments: true,
  },
  {
    delays: {
      DYNAMIC_DELAY: (context) => {
        console.log('DYNAMIC DELAY : ', context);
        return context.delay;
      },
    },
    services: {
      playSound: async () => {
        alert('sound old ! ');
      },
    },
  }
);

function StartTimer({
  startTimer,
  isRunning,
  numberRan,
}: {
  startTimer: () => void;
  isRunning: boolean;
  numberRan: number;
}) {
  return (
    <div
      className="flex flex-col  items-center justify-center h-screen w-screen cursor-pointer"
      onClick={startTimer}
    >
      <Confetti active={!isRunning} config={config} />

      {isRunning ? null : (
        <div className="h-16">
          <span className="fixed top-0 right-0">{numberRan}</span>
          <button className="py-2 px-4 bg-green-300 rounded-lg text-green-800">
            Dis moi quand je peux manger !
          </button>
        </div>
      )}
    </div>
  );
}

function SetTimerTime({ onSet }: { onSet: (delay: number) => void }) {
  const [itm, setItm] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="flex ">
        <input
          value={itm}
          onChange={(event) => setItm(parseInt(event.target.value))}
          type="number"
          className="px-3 text-black rounded-lg w-20 mr-5"
        />
        <button
          className="bg-blue-300 text-blue-800 rounded-lg py-2 px-4"
          onClick={() => {
            onSet(itm);
          }}
        >
          Commencer !
        </button>
      </div>
      <div className="flex mt-8 space-x-5">
        {[10, 15, 20].map((it) => {
          return (
            <button
              key={it}
              className="bg-orange-300 text-orange-800 rounded-lg py-2 px-4"
              onClick={() => onSet(it)}
            >
              {it}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [playSond] = useSound(eatSound, { volume: 1 });
  const [current, send] = useMachine(toggleMachine, {
    devTools: false,
    services: {
      playSound: async (context) => {
        if (context.count === 0) {
          return;
        }
        playSond();
      },
    },
  });

  if (current.matches('inactive')) {
    return (
      <SetTimerTime
        onSet={(delay) => send({ type: 'SET_DELAY', delay: delay * 1000 })}
      />
    );
  }

  return (
    <StartTimer
      startTimer={() => send({ type: 'TRIGGER' })}
      isRunning={!current.matches('ready')}
      numberRan={current.context.count}
    />
  );
}
