'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾があるかどうかをtrue,falseを引数に与えて数値に変換する関数
const isBombThere = (isthere: boolean): number => {
  return isthere === true ? 1 : 0;
};

//初めてのクリックで爆弾を配置する関数
const createMine = (
  x: number,
  y: number,
  userInputs: number[][],
  bombMap: number[][],
): number[][] => {
  //xとyをもとにuseInput.flat()のindexを生成
  const makeIndex = (x: number, y: number): number => {
    return y * 9 + x;
  };
  //一次元のbombArrayにランダムに1を入れる
  const generateBombArray = (): number[][] => {
    const bombArray: number[] = bombMap.flat(); //ランダムに処理
    for (let i = 0; i < 10; i++) {
      const randomX: number = Math.floor(Math.random() * 9);
      const randomY: number = Math.floor(Math.random() * 9);
      bombArray[makeIndex(randomX, randomY)] === isBombThere(true);
    }
    if (bombArray[makeIndex(x, y)] === isBombThere(false)) {
      const reviveBombMap: number[][] = [];
      reviveBombMap.push(bombArray.splice(0, 8));
      return reviveBombMap;
    } else {
      generateBombArray();
    }
  };
  //userInputsの要素が全て0ならばそれは初回と同義
  if (userInputs.flat().filter((userInputs) => userInputs === isBombThere(false)).length === 0) {
    const result = generateBombArray();
  }
  return result;
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
    console.log('click');
    setBombMap(createMine(x, y, userInputs, bombMap));
    newUserInputs[y][x] = isBombThere(true);
    setUserInputs(newUserInputs);
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
              {column === isBombThere(true) ? isBombThere(true) : isBombThere(false)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

//#TODOとりあえずonclickで実装いづれはmouseDownとmouseUpで動作を分ける
