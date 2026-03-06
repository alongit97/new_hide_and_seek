function renderHiderBoardPage() {
    const jsxCode = `
        function reducer(state, action){
            switch(action.type){
                case "setDistribution":
                    return {...state, distribution: action.distribution}
                case "setModal":
                    return {...state, modal: action.modal}
                case "closeModal":
                    return {...state, modal: null}
                case "finishRounds":
                    return {...state, currentStep: "feedback"}
                default:
                    return state
            }
        }

        const initialState = {
            multipliers: js_vars.multipliers,
            totalNumberOfObjects: js_vars.totalNumberOfObjects,
            distribution: Array(js_vars.multipliers.length).fill(0),
            modal: null,
        }

        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)

        function HiderBoardPage(props){
            const [state, dispatch] = React.useReducer(reducer, initialState)
            return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <section>
                            <Rounds {...props}/>
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
            )
        }

        function Rounds(props){
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            const [progress, setProgress] = React.useState("distribution")
            const [selectedBoxIndex, setSelectedBoxIndex] = React.useState(null)
            const [temporaryNumber, setTemporaryNumber] = React.useState(null)

            const numberOfObjectsInStorage = React.useMemo(() => {
                const total = state.totalNumberOfObjects
                const hidden = state.distribution.reduce((a,b)=>a+b,0)
                return total - hidden
            }, [state.distribution])

            function onDistributionChange(numberOfObjects, boxIndex){
                const newDistribution = [...state.distribution]
                newDistribution[boxIndex] = numberOfObjects
                if(newDistribution.reduce((a,b)=>a+b,0) > state.totalNumberOfObjects) return
                dispatch({type:"setDistribution", distribution: newDistribution})
                newDistribution.forEach((num, idx) => {
                    liveSend({action:"set_number_of_objects", box_index: idx, number_of_objects: num})
                })
            }

            function onBoxBlur(boxIndex){
                if(isNaN(parseInt(temporaryNumber)) || parseInt(temporaryNumber)<0){
                    setTemporaryNumber(null)
                } else {
                    onDistributionChange(parseInt(temporaryNumber), boxIndex)
                }
                setSelectedBoxIndex(null)
                setTemporaryNumber(null)
            }

            function onBoxChange(newValue){
                setTemporaryNumber(newValue)
            }

            function onReset(){
                dispatch({type:"setDistribution", distribution: Array(state.distribution.length).fill(0)})
                setProgress("distribution")
            }

            function onDone(){
                liveSend({action: 'finish_round'})
            }

            const storageClassName = () => {
                return numberOfObjectsInStorage === 0 ? "storage green" : "storage"
            }

            return (
                <section>
                    <h4>Round {props.roundNumber}</h4>
                    <div className="hider-board">
                        {/* Row 1: Objects remaining + boxes */}
                        <div className="board-row background-yellow">
                            <div className="info">
                                <p>
                                    <u>Your Task:</u><br/>
                                    You need to hide {numberOfObjectsInStorage} items in the boxes.
                                </p>
                            </div>
                            <div className={storageClassName()}>
                                <h4>{numberOfObjectsInStorage}</h4>
                                <span>Objects left to hide</span>
                            </div>
                            <div className="boxes-area">
                                <div className="boxes">
                                    {state.distribution.map((num, idx)=>(
                                        <div className="box-container" key={idx}>
                                            <div className="box box-open hider">
                                                <input
                                                    type="number"
                                                    value={selectedBoxIndex===idx ? temporaryNumber : num.toString()}
                                                    onFocus={()=>setSelectedBoxIndex(idx)}
                                                    onBlur={()=>onBoxBlur(idx)}
                                                    onChange={(e)=>onBoxChange(e.target.value)}
                                                    onKeyDown={(e)=>{if(e.key==="Enter"){onBoxBlur(idx); e.target.blur()}}}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Multipliers */}
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                The items will multiply in the boxes
                            </div>
                            <div className="storage-placeholder"></div>
                            <div className="boxes">
                                {state.multipliers.map((mult, idx)=>(
                                    <div className="box-container" key={idx}>
                                        <h6 className="arrow-down">×{mult}</h6>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 3: Box values */}
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                Another player will choose {js_vars.boxesToOpen} {js_vars.boxesToOpen > 1 ? "boxes" : "box"} to “steal”.
                            </div>
                            <div className="storage-placeholder"></div>
                            <div className="boxes">
                                {state.distribution.map((num, idx)=>(
                                    <div className="box-container" key={idx}>
                                        <div className="box-closed box">
                                            <span>{num * state.multipliers[idx]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="footer">
                            {numberOfObjectsInStorage===0 &&
                                <div className="buttons">
                                    <button className="btn btn-primary" type="button" onClick={onDone}>Done</button>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            )
        }
    `
    renderReactComponent(jsxCode, "react-root", "HiderBoardPage", JSON.stringify(js_vars));
}

// =======================================
// Seeker page
// =======================================
function renderSeekerBoardPage() {
    const jsxCode = `
        function reducer(state, action){
            switch(action.type){
                case "setSelection":
                    const newSel = [...state.selection]
                    newSel[action.index] = action.isSelected
                    return {...state, selection: newSel}
                case "setModal":
                    return {...state, modal: action.modal}
                case "closeModal":
                    return {...state, modal:null}
                case "finishRounds":
                    return {...state, currentStep:"feedback"}
                default:
                    return state
            }
        }

        const initialState = {
            multipliers: js_vars.multipliers,
            totalNumberOfObjects: js_vars.totalNumberOfObjects,
            selection: Array(js_vars.multipliers.length).fill(false),
            modal: null,
        }

        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)

        function HiderBoardPage(props){
            const [state, dispatch] = React.useReducer(reducer, initialState)
            return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <section>
                            <Rounds {...props}/>
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
            )
        }

        function Rounds(props){
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)

            function onBoxClick(idx){
                const selected = !state.selection[idx]
                liveSend({
                    action: 'set_selection',
                    selection: state.selection.map((s,i)=>i===idx?selected:s)
                })
                dispatch({type:"setSelection", index: idx, isSelected: selected})
            }

            const isReady = state.selection.filter(s=>s).length === js_vars.boxesToOpen

            return (
                <section>
                    <h4>Round {props.roundNumber}</h4>
                    <div className="hider-board">

                        {/* Row 1: storage / distributed objects */}
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                <p>Another player distributed {state.totalNumberOfObjects} items into boxes.</p>
                            </div>
                            <div className="storage-placeholder"></div>
                            <div className="boxes">
                                {state.selection.map((_,idx)=>(
                                    <div className="box-container" key={idx}>
                                        <div className="box box-open hider"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 2: multipliers */}
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">The items have multiplied</div>
                            <div className="storage-placeholder"></div>
                            <div className="boxes">
                                {state.multipliers.map((mult, idx)=>(
                                    <div className="box-container" key={idx}>
                                        <h6 className="arrow-down">×{mult}</h6>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 3: selection */}
                        <div className="board-row background-yellow">
                            <div className="info">
                                <p><u>Your Task:</u><br/>Choose {js_vars.boxesToOpen} {js_vars.boxesToOpen > 1 ? "boxes" : "box"} to take.</p>
                            </div>
                            <div className="storage-placeholder"></div>
                            <div className="boxes">
                                {state.selection.map((sel, idx)=>(
                                    <div className="box-container" key={idx}>
                                        <div className="box-closed box"><span>?</span></div>
                                        <input type="checkbox" checked={sel} onChange={()=>onBoxClick(idx)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="footer">
                            {isReady &&
                                <div className="buttons">
                                    <button className="btn btn-primary" type="button" onClick={()=>liveSend({action:"finish_round"})}>Done</button>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            )
        }
    `
    renderReactComponent(jsxCode, "react-root", "HiderBoardPage", JSON.stringify(js_vars));
}

// =======================================
// Initialization
// =======================================
window.addEventListener("load", () => {
    const role = js_vars.role
    if(role==="seeker"){
        renderSeekerBoardPage()
    } else {
        renderHiderBoardPage()
    }
})

function liveRecv(data){
    if(data.action==="finish_round"){
        const finishElement = document.createElement("input")
        finishElement.type = "hidden"
        finishElement.name = "finished"
        finishElement.value = "true"
        document.querySelector("form").appendChild(finishElement)
        document.querySelector("form").submit()
    }
}
