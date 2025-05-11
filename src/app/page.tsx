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
//newBombMapをいじるだけ
const makeBombMap = (
  userInputs: number[][],
  bombMap: number[][],
  newBombMap: number[][],
  clickX: number,
  clickY: number,
) => {
  const countInputs: number = userInputs
    .flat()
    .filter((userInputs) => userInputs === isBombThere(false)).length;
  if (countInputs === 90) {
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
      const randomX = randomIndex[j] % 9;
      const randomY = Math.floor(randomIndex[j] / 9);
      newBombMap[randomY][randomX] = isBombThere(true);
      //検証用 clickX,YとrandomX,Yが同じでなければ成功
      console.log('click:', clickX, clickY);
      console.log('random:', randomX, randomY);
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
    makeBombMap(userInputs, bombMap, newBombMap, clickX, clickY);

    // createBombMap(userInputs, bombMap, newBombMap, clickX, clickY);
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
