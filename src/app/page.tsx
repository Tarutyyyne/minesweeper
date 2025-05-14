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

const boardArrays: number[][] = [];
const rowArray: number[] = [];
const makeBoardArray = (boardArrays: number[][], rowArray: number[]): number[][] => {
  // これは浅いコピーだから不都合が起きた
  // const copyRowArray: number[] = [...rowArray];
  // for (let i = 0; i < WIDTH; i++) {
  //   copyRowArray.push(0);
  // }
  // const copyBoardArray: number[][] = [...boardArrays];
  // for (let j = 0; j < HEIGHT; j++) {
  //   copyBoardArray.push(copyRowArray);
  // }
  // return copyBoardArray;
  //なので深いコピーってやつをする
  //まずboardArraysの一番外側の配列を.mapでループし
  //各要素rowを引数に取る
  //配列rowの全要素を新しい配列としてスプレッド構文は展開
  //こうすることで全く別の配列が得られて浅いコピーを免れることができる
  const newBoard: number[][] = boardArrays.map((row) => [...row]);
  // Array(WIDTH).fill(0)これだと配列の型が暗黙的にany[]になっているというエラーがでる
  // Array.fromの方がコールバック関数の戻り値として０を返し明確に型が分かる
  const tenplateRow: number[] = [...rowArray, ...Array.from({ length: WIDTH }, () => 0)];
  for (let i = 0; i < HEIGHT; i++) {
    newBoard.push([...tenplateRow]);
  }
  return newBoard;
};

const numbers = [1, 2, 3, 4];
const double = numbers.map((number) => {
  return number * 2;
});
console.log(double);

//x, y座標を一つの数字にする関数
const makeIndex = (y: number, x: number): number => {
  return y * HEIGHT + x;
};
//newBombMapをいじるだけ
const makeMineMap = (
  userInputs: number[][],
  bombMap: number[][],
  newBombMap: number[][],
  clickX: number,
  clickY: number,
  directions: number[][],
) => {
  const countInputs: number = userInputs.flat().filter((userInputs) => userInputs === OPEN).length;
  if (userInputs[clickY][clickX] < OPEN && countInputs === 0) {
    const deleteXY: number = makeIndex(clickX, clickY);
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
      const randomX = Math.floor(randomIndex[j] / WIDTH);
      const randomY = randomIndex[j] % HEIGHT;
      newBombMap[randomY][randomX] = BOMB;
      for (let k = 0; k < 8; k++) {
        const predictX = randomX + directions[k][1];
        const predictY = randomY + directions[k][0];
        //undefinedが返されたらこのif文でcontinueさせる
        if (bombMap[predictY] === undefined) {
          continue;
        }
        //上のおかげで「もしundefinedじゃないなら」というifのネストを減らせる
        if (bombMap[predictY][predictX] === BOMB && newBombMap[predictY][predictX] === BOMB) {
          continue;
        } else if (
          bombMap[predictY][predictX] !== BOMB &&
          newBombMap[predictY][predictX] !== BOMB
        ) {
          newBombMap[predictY][predictX] += SAFE[1];
        } else {
          continue;
        }
      }
    }
  }
};

export default function Home() {
  const [userInputs, setUserInputs] = useState(makeBoardArray(boardArrays, rowArray));
  const newUserInputs: number[][] = structuredClone(userInputs);
  const [mineMap, setMineMap] = useState(makeBoardArray(boardArrays, rowArray));
  const newMineMap: number[][] = structuredClone(mineMap);
  // もろもろの処理はこの中に書こうかな
  const makeGameBoard = (userInputs: number[][], bombMap: number[][]): number[][] => {
    const gameBoard: number[][] = makeBoardArray(boardArrays, rowArray);
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        gameBoard[i][j] = bombMap[i][j] + userInputs[i][j];
      }
    }
    return gameBoard;
  };

  // makeGameBoard(newUserInputs, newMineMap);

  const clickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
    bombMap: number[][],
    newBombMap: number[][],
    directions: number[][],
  ) => {
    // makeGameBoard(newUserInputs, newMineMap);
    makeMineMap(userInputs, bombMap, newBombMap, clickX, clickY, directions);
    setMineMap(newBombMap);
    newUserInputs[clickY][clickX] = OPEN;
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInputs} style={{}}>
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
