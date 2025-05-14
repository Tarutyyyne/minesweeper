'use client';

import { useState } from 'react';
import styles from './page.module.css';

const WIDTH = 7;
const HEIGHT = 9;

const boardArrays: number[][] = [];
const rowArray: number[] = [];
const makeBoardArray = (boardArrays: number[][], rowArray: number[]): number[][] => {
  const copyRowArray: number[] = [...rowArray];
  for (let i = 0; i < WIDTH; i++) {
    copyRowArray.push(0);
  }
  const copyBoardArray: number[][] = [...boardArrays];
  for (let j = 0; j < HEIGHT; j++) {
    copyBoardArray.push(copyRowArray);
  }
  return copyBoardArray;
};
export default function Home() {
  const [userInputs, setUserInputs] = useState(makeBoardArray(boardArrays, rowArray));
  const newUserInputs: number[][] = structuredClone(userInputs);
  const [bombMap, setBombMap] = useState(makeBoardArray(boardArrays, rowArray));
  const newBombMap: number[][] = structuredClone(bombMap);
  console.log(userInputs);

  return (
    <div className={styles.container}>
      <div className={styles.userInputs} style={{ width: 30 * WIDTH, height: 30 * HEIGHT }}>
        {userInputs.map((row, y) =>
          row.map((column, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              {column}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
