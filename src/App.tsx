import * as C from "./App.styles";
import logoImage from './assets/devmemory_logo.png'
import { InfoItem } from "./components/InfoItem";
import { Button } from "./components/Button";
import RestartIcon from "./svgs/restart.svg"
import { useEffect, useState } from "react";
import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";

const App = () => {
   const [playing, setPlaying] = useState<boolean>(false);
   const [timeElapsed, setTimeElapsed] = useState<number>(0); // Timer do Jogo
   const [moveCount, setMoveCount] = useState<number>(0); // Qnt. de movimentos feitos
   const [shownCount, setShownCount] = useState<number>(0); // Qnt. de cartas sendo exibidas.
   const [gridItems, setGridItems] = useState<GridItemType[]>([]); //Todas as cartas

   //new game
   useEffect(() => {
      resetAndCreateGrid();
   }, []);

   //start timer
   useEffect(() => {
      const timer = setInterval(() => {
         if (playing) {
            setTimeElapsed(timeElapsed + 1);
         }
      }, 1000);

      return () => clearInterval(timer);

   }, [playing, timeElapsed]);
   
   useEffect(() => {
      if (shownCount === 2) {
         let opened = gridItems.filter(item => item.shown === true);

         if (opened.length === 2) {
            if (opened[0].item === opened[1].item) { //matching cards
               let tmpGrid = [...gridItems];

               for (let i in tmpGrid) {
                  if (tmpGrid[i].shown) {
                     tmpGrid[i].permanentShown = true;
                     tmpGrid[i].shown = false;
                  }
               }

               setGridItems(tmpGrid);
               setShownCount(0);
            } else {
               setTimeout(() => {
                  let tmpGrid = [...gridItems];

                  for (let i in tmpGrid) {
                     tmpGrid[i].shown = false;
                  }

                  setGridItems(tmpGrid);
                  setShownCount(0);
               }, 1000)
            }



            setMoveCount(moveCount + 1);
         }
      }
   }, [shownCount, gridItems]);

   //game over ?
   useEffect(() => {
      if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
         setPlaying(false);
      }
   }, [moveCount, gridItems])

   //create new game
   const resetAndCreateGrid = () => {
      //reset game
      setTimeElapsed(0);
      setMoveCount(0);
      setShownCount(0);

      //create game
      let tmpGrid: GridItemType[] = [];
      for (let i = 0; i < (items.length * 2); i++) {
         tmpGrid.push({
            item: null,
            shown: false,
            permanentShown: false
         })
      }

      for (let w = 0; w < 2; w++) {
         for (let i = 0; i < items.length; i++) {
            let pos = -1;

            //Executa até encontrar uma posição não preenchida
            while (pos < 0 || tmpGrid[pos].item !== null) {
               pos = Math.floor(Math.random() * (items.length * 2));
            }

            tmpGrid[pos].item = i;
         }
      }

      setGridItems(tmpGrid);

      //play game
      setPlaying(true);
   }

   //turn the card
   const handleItemClick = (index: number) => {
      if (playing && index !== null && shownCount < 2) {
         let tmpGrid = [...gridItems];

         if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
            tmpGrid[index].shown = true;
            setShownCount(shownCount + 1)
         }

         setGridItems(tmpGrid)
      }
   }

   return (
      <C.container>
         <C.Info>
            <C.LogoLink>
               <img src={logoImage} width="200" alt="" />
            </C.LogoLink>

            <C.InfoArea>
               <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
               <InfoItem label="Movimentos" value={moveCount.toString()} />
            </C.InfoArea>

            <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />
         </C.Info>

         <C.GridArea>
            <C.Grid>
               {gridItems.map((item, index) => (
                  <GridItem
                     key={index}
                     item={item}
                     onClick={() => handleItemClick(index)}
                  />
               ))}
            </C.Grid>
         </C.GridArea>
      </C.container>
   );
}

export default App;