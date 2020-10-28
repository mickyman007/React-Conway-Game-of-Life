import React, {useEffect, useState} from "react";

let GridDimension = 20;
let GridSize = GridDimension * GridDimension;

const startTime = new Date() / 1000; //unix standard time
console.log("Start Time: " + startTime);

// const Ticker = (props) => {
//     const {componentToTick, setTime} = props;
//         setInterval(
//             () => setTime(new Date().toLocaleString()),
//             100
//         );
//
//     return (
//         <div>
//             {componentToTick}
//         </div>
//     );
// }

// const GridSpace = (props) => {
//     const {gridPosition, grid, updateGridState} = props;
//
//     let gridSpaceClass = "gridSpace-Dead";
//
//     if (grid[gridPosition].state) {
//         gridSpaceClass = "gridSpace-Alive"
//     }
//
//     return (
//         <td key={gridPosition} className={gridSpaceClass}
//             onClick={() => {
//                 console.log(gridPosition);
//                 updateGridState(gridPosition);
//             }}>
//             <h1>
//                 {gridPosition}
//             </h1>
//         </td>
//     )
// }

// const GridRow = (props) => {
//     const {gridRow, grid, updateGridState} = props;
//
//     return (
//         <tr className={"gridRow"}>
//             {
//                 gridRow.map(
//                     (value, index) => {
//                         return (
//                             <GridSpace
//                                 gridPosition={value.index}
//                                 grid={grid}
//                                 updateGridState={updateGridState}
//                             />
//                         )
//                     }
//                 )
//             }
//         </tr>
//     );
// }

// const Grid = () => {
//     const date = new Date().toString();
//     const [time, setTime] = useState(date);
//     const [grid, setGrid] = useState([]);
//
//     const updateGridState = (gridIndex) => {
//
//         console.log(gridIndex, grid[gridIndex]);
//
//         const tempArray = grid;
//         tempArray[gridIndex].state = !tempArray[gridIndex].state
//
//         setGrid(tempArray)
//         console.log("Set" + gridIndex + " to " + tempArray[gridIndex].state);
//     }
//
//     const setUpGrid = () => {
//         let tempArray = []
//         for (let i = 0; i < GridSize; i++) {
//             tempArray.push({
//                 index : i,
//                 state : false
//             })
//         }
//
//         tempArray.map((value, index) => {
//            if (index + 1 < GridSize
//            && value.state) {
//                tempArray[index + 1].state = value.state;
//            }
//         });
//
//         setGrid(tempArray);
//     }
//
//     useEffect(() => {
//         setUpGrid()
//     }, [])
//
//     const gridComponent = () => {
//         return(
//     <table className={"grid"}>
//         <tbody className="grid">
//         {grid.map((value, index) => {
//             if (index % Math.sqrt(GridSize) === 0) {
//
//                 let sharedHeight = 100 / GridDimension + "%";
//
//                 let gridStyle = (height) => ({
//                     height: height
//                 });
//
//                 return (
//                     <GridRow
//                         className={"gridRow"}
//                         style={gridStyle(sharedHeight)}
//                         gridRow={
//                             grid.slice(
//                                 index,
//                                 index + Math.sqrt(GridSize)
//                             )
//                         }
//                         grid={grid}
//                         updateGridState={updateGridState}
//                     />
//                 )
//             }
//         })
//         }
//         </tbody>
//     </table>
//
// )
//     }
//
//     return (
//         <div>
//             {gridComponent()}
//             {/*<Ticker componentToTick={gridComponent()}*/}
//             {/*    setTime={setTime()}*/}
//             {/*/>*/}
//             <Ticker componentToTick={<p>{time}</p>}
//                 setTime = {setTime}
//             />
//         </div>
//     );
// };

const NewGrid = () => {
    const [time, setTime] = useState(0);
    const [grid, setGrid] = useState([]);

    let gridBoard = []

    const withinBounds = (i) => {
        return (i >= 0 && i < GridSize);
    }

    const getNeighbors = (i) => {
        let directions = [
            i - GridDimension - 1,
            i - GridDimension,
            i - GridDimension + 1,
            i - 1,
            i + 1,
            i + GridDimension - 1,
            i + GridDimension,
            i + GridDimension + 1
        ]

        //console.log(directions)

        let neighbours = [];

        directions.map((value) => {
            if (withinBounds(value)
                && !(i % GridDimension === 0 && value % GridDimension === GridDimension - 1)
                ) {
                neighbours.push(gridBoard[value])
                //console.log(value);
            }
        });

        console.log(i + " " + neighbours)

        return neighbours;
    }

    const initialiseGrid = () => {
        if (grid.length > 0) {
            gridBoard = grid;
        } else {
            for (let i = 0; i < GridSize; i++) {
                gridBoard.push({
                    index: i,
                    state: false
                })
            }
        }
    }

    const iterate = () => {
        let tempBoard = gridBoard;

        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // Any live cell with two or three live neighbours lives on to the next generation.
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        gridBoard.map((value) => {
            let neighbours = getNeighbors(value.index);

            let states = value.index + ": ";

            neighbours.map((neighbour) => {states += neighbour.state + ", "});

            console.log(states);

            let neighboursAlive = neighbours.filter((neighbour) => neighbour.state).length;

            console.log(value.index + " " + neighboursAlive)


            if (neighboursAlive < 2
            || neighboursAlive > 3) {
                tempBoard[value.index].state = false;
            } else {
                tempBoard[value.index].state = true;
            }

        })

        gridBoard = tempBoard;
    }

    useEffect(() => {
        setInterval(() => {
            iterate();
            setTime(Math.trunc((new Date() /1000) - startTime));
            //console.log(gridBoard);
            setGrid(gridBoard);
        }, 5000)
    }, [])

    const BoardSpace = (props) => {
        const {gridSpace} = props;
        const [spaceState, setSpaceState] = useState(gridSpace.state);

        let sharedHeight = 100 / GridDimension + "%";

        let gridStyle = (size) => ({
            height: size,
            width: size
        });

        return (
            <td className={spaceState ? "gridSpace-Alive" : "gridSpace-Dead"}
                style={gridStyle(sharedHeight)}
                onClick={() => {
                    gridSpace.state = !gridSpace.state;
                    gridBoard[gridSpace.index].state = gridSpace.state;
                    //console.log(gridBoard[gridSpace.index]);
                    setSpaceState(gridSpace.state);
                    //this.className = gridSpace.state ? "gridSpace-Alive" : "gridSpace-Dead";
                }
                }>
                {/*<p>{gridSpace.index}</p>*/}
                {/*<p>{gridSpace.state.toString()}</p>*/}
            </td>
        )
    }

    const BoardRow = (props) => {
        const {row} = props;
        //console.log(row);

        //console.log(gridBoard.slice(row*GridDimension, (row+1) * GridDimension));

        return (
            <tr className={"gridRow"}>
                {gridBoard.slice(row*GridDimension, (row+1) * GridDimension)
                    .map((gridSpace, i) =>
                        <BoardSpace gridSpace={gridSpace} />
                        // <td className={gridSpace.state ? "gridSpace-Alive" : "gridSpace-Dead"}
                        // onClick={() => {
                        //     gridSpace.state = !gridSpace.state;
                        //     gridBoard[gridSpace.index].state = gridSpace.state;
                        //     console.log(gridBoard[gridSpace.index])
                        //
                        //     //this.className = gridSpace.state ? "gridSpace-Alive" : "gridSpace-Dead";
                        // }
                        // }>
                        //     <p>{gridSpace.index}</p>
                        //     <p>{gridSpace.state.toString()}</p>
                        // </td>
                    )}
            </tr>
        )
    }

    const BoardTable = () => {
        //console.log(grid)

        initialiseGrid();

        const boardComponent = [];

        for (let i = 0; i < GridDimension; i++) {
            boardComponent.push(
                <BoardRow row={i}/>
            )
        }

        return boardComponent;
    }

    return(
        <div className={"grid"}>
            {/*<Ticker setTime={setTime}*/}
            {/*componentToTick={*/}
            {/*    <h1>{time}</h1>*/}
            {/*}/>*/}
            <h1>{time}</h1>
            <table className={"grid"}>
                <tbody>
                    <BoardTable/>
                </tbody>
            </table>
            {/*{grid.map((value, index) => {*/}
            {/*    return(*/}
            {/*        <p content={index} />*/}
            {/*    )*/}
            {/*})}*/}
        </div>
    )
}

//export default Grid;
export default NewGrid;