'use client';

import { useState } from 'react';
import styles from './page.module.css';
//初めてのクリックで爆弾を配置する関数
const setMine = (userInputs: number[][], bombMap: number[][]): number[][] => {
  //userInputsの要素が全て0ならばそれは初回と同義
  if (userInputs.flat().filter((userInputs) => userInputs === 1).length === 0) {
    console.log('check setMine');
    // console.log('ここにランダムに1を入れる')
    // console.log('そして得られた配列を如何に投げる')
    bombMap[0][0] = 1;
  }
  return bombMap;
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

  const clickCell = (x: number, y: number, newUserInputs: number[][]) => {
    setBombMap(setMine(userInputs, bombMap));
    newUserInputs[y][x] = 1;
    setUserInputs(newUserInputs);
    console.log('click');
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInputs}>
        {bombMap.map((row, y) =>
          row.map((column, x) => (
            <div
              className={styles.cell}
              style={{ backgroundPosition: '-420px' }}
              key={`${x}-${y}`}
              onClick={() => clickCell(y, x, newUserInputs)}
            >
              {column === 1 ? 1 : 0}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

//#TODOとりあえずonclickで実装いづれはmouseDownとmouseUpで動作を分ける
