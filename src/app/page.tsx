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

//x, y座標を一つの数字にする関数
const makeIndex = (y: number, x: number): number => {
  return y * HEIGHT + x;
};
//newBombMapをいじるだけ
const makeMineMap = (
  userInputs: number[][],
  mineMap: number[][],
  newMineMap: number[][],
  clickX: number,
  clickY: number,
) => {
  const countInputs: number = userInputs.flat().filter((userInputs) => userInputs === OPEN).length;
  if (userInputs[clickY][clickX] < OPEN && countInputs === 0) {
    const deleteXY: number = makeIndex(clickX, clickY);
    const randomIndexArray: number[] = Array.from(
      { length: mineMap.flat().length },
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
      const randomX = Math.floor(randomIndex[j] / WIDTH);
      const randomY = randomIndex[j] % HEIGHT;
      newMineMap[randomY][randomX] = BOMB;
      // for (let k = 0; k < 8; k++) {
      //   const predictX = randomX + directions[k][1];
      //   const predictY = randomY + directions[k][0];
      //   //undefinedが返されたらこのif文でcontinueさせる
      //   if (bombMap[predictY] === undefined) {
      //     continue;
      //   }
      //   //上のおかげで「もしundefinedじゃないなら」というifのネストを減らせる
      //   if (bombMap[predictY][predictX] === BOMB && newBombMap[predictY][predictX] === BOMB) {
      //     continue;
      //   } else if (
      //     bombMap[predictY][predictX] !== BOMB &&
      //     newBombMap[predictY][predictX] !== BOMB
      //   ) {
      //     newBombMap[predictY][predictX] += SAFE[1];
      //   } else {
      //     continue;
      //   }
      // }
    }
  }
};

export default function Home() {
  const [userInputs, setUserInputs] = useState(copyDefaultBoard);
  const newUserInputs: number[][] = structuredClone(userInputs);
  const [mineMap, setMineMap] = useState(copyDefaultBoard);
  const newMineMap: number[][] = structuredClone(mineMap);
  // もろもろの処理はこの中に書こうかな
  const gameBoard: number[][] = defaultBoard;
  const makeGameBoard = (userInputs: number[][], mineMap: number[][]): number[][] => {
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        gameBoard[j][i] = mineMap[i][j] + userInputs[i][j];
      }
    }
    //予測値を書く
    const copyGameBoard: number[] = structuredClone(gameBoard).flat();
    const mineCoordinateArray: number[] = [];
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
      if (copyGameBoard[i] !== BOMB) {
        continue;
      } else {
        mineCoordinateArray.push(i);
      }
    }
    for (let j = 0; j < HOW_MANY_BOMB; j++) {
      const mineX: number = Math.floor(mineCoordinateArray[j] / WIDTH);
      const mineY: number = mineCoordinateArray[j] % HEIGHT;
      for (let k = 0; k < 8; k++) {
        const predictX = mineX + directions[k][1];
        const predictY = mineY + directions[k][0];
        //undefinedが返されたらこのif文でcontinueさせる
        if (
          mineMap[predictY] === undefined ||
          gameBoard[predictY] === undefined ||
          mineMap[predictY][predictX] === undefined ||
          gameBoard[predictY][predictX] === undefined
        ) {
          continue;
        }
        //上のおかげで「もしundefinedじゃないなら」というifのネストを減らせる
        if (mineMap[predictY][predictX] === BOMB) {
          continue;
        } else if (mineMap[predictY][predictX] !== BOMB) {
          gameBoard[predictX][predictY] += 1;
        } else {
          continue;
        }
      }
    }
    return gameBoard;
  };

  const clickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
    mineMap: number[][],
    newMineMap: number[][],
    directions: number[][],
  ) => {
    makeMineMap(userInputs, mineMap, newMineMap, clickX, clickY);
    setMineMap(newMineMap);
    // makeGameboardをぶちこむ
    makeGameBoard(userInputs, mineMap);
    newUserInputs[clickX][clickY] = OPEN;
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.userInputs}
        style={{ width: `${30 * WIDTH}px`, height: `${30 * HEIGHT}px` }}
      >
        {makeGameBoard(newUserInputs, newMineMap).map((row, y) =>
          row.map((column, x) => (
            <button
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() =>
                clickCell(x, y, userInputs, newUserInputs, mineMap, newMineMap, directions)
              }
            >
              {column}
            </button>
          )),
        )}
      </div>
    </div>
  );
}
