'use client';

import { useState } from 'react';
import styles from './page.module.css';

//普通に定数にした。なぜわざわざ関数を作ったのだろうか。
const SAFE: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const BOMB = 9;
const OPEN = 10;
const FLAG = 20;
const QUESTION = FLAG * 2;
const REMOVE = -(FLAG + QUESTION);

//x, y座標を一つの数字にする関数
const makeIndex = (y: number, x: number): number => {
  return y * 9 + x;
};
//newBombMapをいじるだけ
const makeBombMap = (
  userInputs: number[][],
  bombMap: number[][],
  newBombMap: number[][],
  clickX: number,
  clickY: number,
) => {
  const countInputs: number = userInputs.flat().filter((userInputs) => userInputs === OPEN).length;
  if (countInputs === 0) {
    const deleteXY: number = makeIndex(clickX, clickY);
    const randomIndexArray: number[] = Array.from(
      { length: bombMap.flat().length },
      (_, index) => index,
    ).filter((index) => index !== deleteXY);
    const copyRandomIndexArray: number[] = [];
    for (let i = 0; i < 80; i++) {
      const shuffleIndex = Math.floor(Math.random() * randomIndexArray.length);
      copyRandomIndexArray.push(randomIndexArray[shuffleIndex]);
      randomIndexArray.splice(shuffleIndex, 1);
    }
    const randomIndex: number[] = copyRandomIndexArray.splice(0, 10);
    for (let j = 0; j < 10; j++) {
      const randomX = Math.floor(randomIndex[j] / 9);
      const randomY = randomIndex[j] % 9;
      newBombMap[randomY][randomX] = BOMB;
    }
  }
};

export default function Home() {
  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newUserInputs = structuredClone(userInputs);
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newBombMap: number[][] = structuredClone(bombMap);

  //今からuserInputsとbombMapを一つにまとめたgameBoardを計算値として求まるように書く
  const makeGameBoard = (userInputs: number[][], bombMap: number[][]): number[][] => {
    const gameBoard: number[][] = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
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
    //一回だけ
    // console.log('click');
    makeBombMap(userInputs, bombMap, newBombMap, clickX, clickY);
    setBombMap(newBombMap);
    //以下開く動作
    console.log('check');
    if (
      makeGameBoard(userInputs, bombMap)
        .flat()
        .includes(BOMB + OPEN) === true ||
      userInputs[clickY][clickX] >= FLAG
    ) {
      return;
    } else {
      newUserInputs[clickY][clickX] = OPEN;
    }
    setUserInputs(newUserInputs);
  };

  //#TODOここに右クリックの関数を書く
  const rightClickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
  ) => {
    event.preventDefault();
    if (userInputs[clickY][clickX] === OPEN) {
      return;
    } else if (Math.floor(userInputs[clickY][clickX] / 20) === 0) {
      newUserInputs[clickY][clickX] += FLAG;
    } else if (Math.floor(userInputs[clickY][clickX] / 20) === 1) {
      newUserInputs[clickY][clickX] += QUESTION;
    } else if (Math.floor(userInputs[clickY][clickX] / 20) === 3) {
      newUserInputs[clickY][clickX] += REMOVE;
    }
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div>
        {makeGameBoard(userInputs, bombMap)
          .flat()
          .includes(OPEN + BOMB)
          ? 'game over'
          : 'playing'}
      </div>
      <div className={styles.userInputs}>
        {makeGameBoard(userInputs, bombMap).map((row, y) =>
          row.map((column, x) => (
            <div
              className={styles.cell}
              style={{ backgroundPosition: '-420px' }}
              key={`${x}-${y}`}
              onClick={() => clickCell(x, y, userInputs, newUserInputs, bombMap, newBombMap)}
              onContextMenu={() => rightClickCell(x, y, userInputs, newUserInputs)}
            >
              {column}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

//#TODOとりあえずonclickで実装いづれはmouseDownとmouseUpで動作を分ける
