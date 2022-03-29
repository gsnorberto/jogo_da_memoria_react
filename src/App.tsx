import * as C from "./App.styles";
import logoImage from './assets/devmemory_logo.png'
import { InfoItem } from "./components/InfoItem";
import { Button } from "./components/Button";
import RestartIcon from "./svgs/restart.svg"
import { useEffect, useState } from "react";
import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";

const App = () => {
   const [playing, setPlaying] = useState<boolean>(false);
   const [timeElapsed, setTimeElapsed] = useState<number>(0); // Timer do Jogo
   const [moveCount, setMoveCount] = useState<number>(0); // Qnt. de movimentos feitos
   const [shownCount, setShownCount] = useState<number>(0); // Qnt. de cartas sendo exibidas.
   const [gridItems, setGridItems] = useState<GridItemType[]>([]);

   useEffect(() => {
      resetAndCreateGrid();
   }, []);

   const resetAndCreateGrid = () => {
      //reset game
      setTimeElapsed(0);
      setMoveCount(0);
      setShownCount(0);

      //create game
      let tmpGrid: GridItemType[] = [];
      for(let i = 0; i < (items.length * 2); i++){
         tmpGrid.push({
            item: null,
            shown: false,
            permanentShown: false
         })
      }

      for(let w = 0; w < 2; w++){
         for(let i = 0; i < items.length; i++){
            let pos = Math.floor(Math.random() * (items.length * 2));
            tmpGrid[pos].item = i;
         }
      }


      setGridItems(tmpGrid);

      //play game
      setPlaying(true);
   }

   return (
      <C.container>
         <C.Info>
            <C.LogoLink>
               <img src={logoImage} width="200" alt="" />
            </C.LogoLink>

            <C.InfoArea>
               <InfoItem label="Tempo" value="00:00" />
               <InfoItem label="Movimentos" value="0" />
            </C.InfoArea>

            <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid}/>
         </C.Info>

         <C.GridArea>
            <C.Grid>

            </C.Grid>
         </C.GridArea>
      </C.container>
   );
}

export default App;