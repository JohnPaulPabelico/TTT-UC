"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  const increase = () => setCount(count + 1);
  const decrease = () => setCount(count - 1);
  const reset = () => setCount(0);

  useEffect(() => {
    console.log(`Count is now: ${count}`);
  }, [count]);

  return (
    <>
      <div className="min-h-dvh flex flex-col items-center justify-center">
        <h1>React Counter App</h1>
        <CounterDisplay count={count} />
        <div className="mt-5 flex gap-5 justify-center items-center">
          <button
            className="px-4 py-2 bg-green-600 rounded-md"
            onClick={increase}
          >
            Increase
          </button>
          <button
            className="px-4 py-2 bg-red-600 rounded-md"
            onClick={decrease}
          >
            Decrease
          </button>
          <button
            className="px-4 py-2 bg-neutral-600 rounded-md"
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

interface ICounterProps {
  count: number;
}

function CounterDisplay({ count }: ICounterProps) {
  return (
    <div className="text-3xl font-bold mt-5">
      <p>
        Current Count: <strong>{count}</strong>
      </p>
    </div>
  );
}
