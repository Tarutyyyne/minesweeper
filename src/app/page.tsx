'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾があるかどうかをtrue,falseを引数に与えて数値に変換する関数
const isBombThere = (isthere: boolean): number => {
  return isthere === true ? 1 : 0;
};

//x, y座標を一つの数字にする関数
const makeIndex = (x: number, y: number): number => {
  return y * 9 + x;
};
//newBoardをいじるだけ
const createBombMap = (
  userInputs: number[][],
  bombMap: number[][],
  newBombMap: number[][],
  clickX: number,
  clickY: number,
) => {
  const countInputs: number = userInputs
    .flat()
    .filter((userInputs) => userInputs === isBombThere(false)).length;
  //if文の中は一回だけ実行
  if (countInputs === 90) {
    //clickX,clickYを0とした配列をつくりたいのでこれはその差分
    const zeroMeasure: number = makeIndex(clickX, clickY);
    //randomX, randomYのリストを取得するためのプロセス
    const randomIndexArray: number[] = Array.from(
      { length: bombMap.flat().length - 1 },
      (_, index) => index + 1,
    ).filter((index) => index !== zeroMeasure); // !==でclickX, clickYを除外
    console.log(randomIndexArray);
    const copyRandomIndexArray: number[] = [];
    for (let j = 0; j < 80; j++) {
      const shuffleIndex = Math.floor(Math.random() * randomIndexArray.length);
      copyRandomIndexArray.push(randomIndexArray[shuffleIndex]);
      randomIndexArray.splice(shuffleIndex, 1);
    }
    const randomIndex: number[] = copyRandomIndexArray.splice(0, 10);
    // console.log(randomIndex);
    for (let k = 0; k < 10; k++) {
      const randomY = randomIndex[k] % 9;
      const randomX = Math.floor(randomIndex[k] / 9);
      console.log(randomX, randomY);
      newBombMap[randomY][randomX] = isBombThere(true);
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

  const clickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
    bombMap: number[][],
    newBombMap: number[][],
  ) => {
    createBombMap(userInputs, bombMap, newBombMap, clickX, clickY);
    setBombMap(newBombMap);
    newUserInputs[clickY][clickX] = 1;
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInputs}>
        {bombMap.map((row, clickY) =>
          row.map((column, clickX) => (
            <div
              className={styles.cell}
              style={{ backgroundPosition: '-420px' }}
              key={`${clickX}-${clickY}`}
              onClick={() =>
                clickCell(clickX, clickY, userInputs, newUserInputs, bombMap, newBombMap)
              }
            >
              {column === isBombThere(true) ? isBombThere(true) : isBombThere(false)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

//#TODOとりあえずonclickで実装いづれはmouseDownとmouseUpで動作を分ける
