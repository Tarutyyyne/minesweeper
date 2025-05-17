'use client';

import { useState } from 'react';
import styles from './page.module.css';

const HOW_MANY_BOMB = 10;
const WIDTH = 9;
const HEIGHT = 9;
const SAFE: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const BOMB = 9;
const OPEN = 10;
const FLAG = 30;
const QUESTION = FLAG * 2;
const REMOVE = FLAG + QUESTION;

const createBoard = (width: number, height: number): number[][] => {
  return Array.from({ length: height }, () => Array(width).fill(0) as number[]);
};
const defaultBoard: number[][] = createBoard(WIDTH, HEIGHT);
const copyDefaultBoard = structuredClone(defaultBoard);

const directions: number[][] = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];
const makeIndex = (y: number, x: number) => {
  return y * HEIGHT + x;
};

const makeBombMap = (
  clickX: number,
  clickY: number,
  userInputs: number[][],
  bombMap: number[][],
  newBombMap: number[][],
  directions: number[][],
) => {
  const countInputs: number = userInputs.flat().filter((userInput) => userInput === OPEN).length;
  if (userInputs[clickY][clickX] < OPEN && countInputs === 0) {
    const deleteXY: number = makeIndex(clickY, clickX);
    const randomIndexArray: number[] = Array.from(
      { length: bombMap.flat().length },
      (_, index) => index,
    ).filter((index) => index !== deleteXY);
    const copyRandomIndexArray: number[] = [];
    for (let i = 0; i < WIDTH * HEIGHT - 1; i++) {
      const shuffleIndex = Math.floor(Math.random() * randomIndexArray.length);
      copyRandomIndexArray.push(randomIndexArray[shuffleIndex]);
      randomIndexArray.splice(shuffleIndex, 1);
    }
    const randomIndex: number[] = copyRandomIndexArray.splice(0, HOW_MANY_BOMB);
    for (let j = 0; j < HOW_MANY_BOMB; j++) {
      const randomX: number = Math.floor(randomIndex[j] / WIDTH);
      const randomY: number = randomIndex[j] % HEIGHT;
      newBombMap[randomY][randomX] = BOMB;
      for (let k = 0; k < 8; k++) {
        const predictX: number = randomX + directions[k][1];
        const predictY: number = randomY + directions[k][0];
        if (bombMap[predictY] === undefined) {
          continue;
        }
        if (bombMap[predictY][predictX] === BOMB && newBombMap[predictY][predictX] === BOMB) {
          continue;
        } else if (
          bombMap[predictY][predictX] !== BOMB &&
          newBombMap[predictY][predictX] !== BOMB
        ) {
          console.log('predict');
        } else {
          continue;
        }
      }
    }
  }
};

export default function Home() {
  const [userInputs, setUserInputs] = useState(copyDefaultBoard);
  const newUserInputs: number[][] = structuredClone(userInputs);
  const [bombMap, setBombMap] = useState(copyDefaultBoard);
  const newBombMap: number[][] = structuredClone(bombMap);

  //今からuserInputsとbombMapを一つにまとめたgameBoardを計算値として求まるように書く
  const makeGameBoard = (userInputs: number[][], bombMap: number[][]): number[][] => {
    const gameBoard: number[][] = createBoard(WIDTH, HEIGHT);
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        gameBoard[i][j] = bombMap[i][j] + userInputs[i][j];
      }
    }
    return gameBoard;
  };
  makeGameBoard(userInputs, bombMap);

  const clickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
    bombMap: number[][],
    newBombMap: number[][],
  ) => {
    makeBombMap(clickX, clickY, userInputs, bombMap, newBombMap, directions);
    setBombMap(newBombMap);
    newUserInputs[clickY][clickX] = OPEN;
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.userInputs}
        style={{ width: `${30 * WIDTH}px`, height: `${30 * HEIGHT}px` }}
      >
        {makeGameBoard(userInputs, bombMap).map((row, y) =>
          row.map((column, x) => (
            <button
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => clickCell(x, y, userInputs, newUserInputs, bombMap, newBombMap)}
            >
              {column}
            </button>
          )),
        )}
      </div>
    </div>
  );
}
