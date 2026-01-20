function renderTestPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }

        const steps = [
            <Question 
                label={<span>If the Hider hides all 7 items in box B2 and the Opener opens box B4, How much will they each get?</span>}
                id="question_1"
                expectedHiderAnswer="14"
                expectedOpenerAnswer="0"
            />,
            <Question
                label={<span>If the Hider hides 2 items in box B2 and 5 items in box B4 and the Opener opens box B4, How much will they each get?</span>}
                id="question_2"
                expectedHiderAnswer="4"
                expectedOpenerAnswer="20"
            />,
            <Question
                label={<span>If the Hider hides, again, 2 items in box B2 and 5 items in box B4 and the Opener opens box B2, How much will they each get?</span>}
                id="question_3"
                expectedHiderAnswer="20"
                expectedOpenerAnswer="4"
            />,    
            <EndTest/>                            
        ]

        function reducer(state, action){
            if (action.type === "submitQuestion"){
                const currentStep = steps[state.currentStepIndex]
                const expectedHiderAnswer = currentStep.props.expectedHiderAnswer
                const expectedOpenerAnswer = currentStep.props.expectedOpenerAnswer

                const hiderAnswer = state.hiderAnswer.value
                const openerAnswer = state.openerAnswer.value

                const hiderAnswerIsCorrect = hiderAnswer === expectedHiderAnswer
                const openerAnswerIsCorrect = openerAnswer === expectedOpenerAnswer

                liveSend({
                    action: "submit_question",
                    question_id: currentStep.props.id,
                    hider_answer: hiderAnswer,
                    opener_answer: openerAnswer,
                    hider_answer_is_correct: hiderAnswerIsCorrect,
                    opener_answer_is_correct: openerAnswerIsCorrect,
                    mistakes_count: state.mistakesCount,
                })

                if (!hiderAnswerIsCorrect || !openerAnswerIsCorrect){
                    if (state.mistakesCount === 0){
                        return {
                            ...state,
                            mistakesCount: 1
                        }
                    }

                    return {
                        ...state,
                        endedSuccessfully: false,
                        currentStepIndex: steps.length - 1
                    }
                }

                return {
                    ...state,
                    showCorrect: true
                }
            }

            if (action.type === "advanceAfterCorrect"){
                const nextStep = steps[state.currentStepIndex + 1]
                const isLastStep = nextStep.type.name === "EndTest"

                if (isLastStep){
                    return {
                        ...state,
                        endedSuccessfully: true,
                        currentStepIndex: steps.length - 1,
                        showCorrect: false
                    }
                }

                return {
                    ...state,
                    showCorrect: false,
                    mistakesCount: 0,
                    currentStepIndex: state.currentStepIndex + 1,
                    hiderAnswer: { value: "", state: "unanswered" },
                    openerAnswer: { value: "", state: "unanswered" }
                }
            }

            if (action.type === "setHiderAnswer"){
                return {
                    ...state,
                    hiderAnswer: action.hiderAnswer
                }
            }

            if (action.type === "setOpenerAnswer"){
                return {
                    ...state,
                    openerAnswer: action.openerAnswer
                }
            }

            if (action.type === "proceed"){
                return {
                    ...state,
                    currentStepIndex: state.currentStepIndex + 1
                }
            }

            return state
        }

        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)

        function TestPage(props){
            const [state, dispatch] = React.useReducer(reducer, {
                currentStepIndex: props.currentStepIndex ?? 0,
                hiderAnswer: {
                    value: "",
                    state: "unanswered"
                },
                openerAnswer: {
                    value: "",
                    state: "unanswered"
                },
                mistakesCount: props.mistakesCount ?? 0,
                endedSuccessfully: null,
                showCorrect: false
            })

            const currentStep = React.useMemo(
                () => steps[state.currentStepIndex],
                [state.currentStepIndex]
            )

            React.useEffect(() => {
                if (state.showCorrect){
                    const timer = setTimeout(() => {
                        dispatch({ type: "advanceAfterCorrect" })
                    }, 1500)

                    return () => clearTimeout(timer)
                }
            }, [state.showCorrect])

            function onButtonClick(){
                if (state.endedSuccessfully !== null){
                    return document.querySelector("form").submit()
                }

                if (currentStep.type.name === "Question"){
                    dispatch({ type: "submitQuestion" })
                }
            }

            function isInputValid(){
                return (
                    state.hiderAnswer.state === "valid" &&
                    state.openerAnswer.state === "valid"
                )
            }

            return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <input
                            type="hidden"
                            name="ended_successfully"
                            value={state.endedSuccessfully ?? false}
                        />
                        <section>
                            {currentStep.type.name === "Question" && (
                                <h2 style={{ marginBottom: "1rem" }}>
                                    Test {state.currentStepIndex + 1}
                                </h2>
                            )}                       
                            {currentStep}

                            {state.showCorrect && (
                                <p style={{ color: "green", fontWeight: "bold" }}>
                                    CORRECT
                                </p>
                            )}

                            <div className="button-container">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={onButtonClick}
                                    disabled={!isInputValid()}
                                >
                                    {state.endedSuccessfully === false ? "Exit" : "Proceed"}
                                </button>
                            </div>
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
            )
        }

        function Question(props){
            const dispatch = React.useContext(DispatchContext)
            const state = React.useContext(StateContext)

            function validateNumberInput(input){
                if (input === "") return false
                const parsedInput = parseInt(input)
                if (isNaN(parsedInput)) return false
                if (parsedInput !== parseFloat(input)) return false
                if (parsedInput < 0) return false
                return true
            }

            function onHiderAnswerChange(newAnswer){
                const isValid = validateNumberInput(newAnswer)
                dispatch({
                    type: "setHiderAnswer",
                    hiderAnswer: {
                        value: newAnswer,
                        state: isValid ? "valid" : "error"
                    }
                })
            }

            function onOpenerAnswerChange(newAnswer){
                const isValid = validateNumberInput(newAnswer)
                dispatch({
                    type: "setOpenerAnswer",
                    openerAnswer: {
                        value: newAnswer,
                        state: isValid ? "valid" : "error"
                    }
                })
            }

            function inputClassName(answerState){
                let output = "underline-input"
                if (answerState === "error"){
                    output += " error"
                }
                return output
            }

            return (
                <>
                    <p>
                        In the test, there are two boxes: Box B2, which multiplies the value of the items in it by 2,
                        and box B4, which multiplies the value of the items in it by 4.
                        <br />
                        The Hider has 7 items to hide and the Opener opens one of the two boxes.
                    </p>
                    <p>
                        {props.label}
                        <br />
                        The Hider
                        <input
                            type="number"
                            value={state.hiderAnswer.value}
                            onChange={(e) => onHiderAnswerChange(e.target.value)}
                            className={inputClassName(state.hiderAnswer.state)}
                        />
                        The Opener
                        <input
                            type="number"
                            value={state.openerAnswer.value}
                            onChange={(e) => onOpenerAnswerChange(e.target.value)}
                            className={inputClassName(state.openerAnswer.state)}
                        />
                    </p>

                    {state.mistakesCount === 1 && (
                        <p className="error">
                            <span>
                                <b>Incorrect answer. You have 1 attempt remaining.</b>
                            </span>
                        </p>
                    )}
                </>
            )
        }

        function EndTest(){
            const state = React.useContext(StateContext)

            if (state.endedSuccessfully === true){
                return (
                    <p>
                        You have completed the test successfully. Please proceed to the next page.
                    </p>
                )
            }

            if (state.endedSuccessfully === false){
                return document.querySelector("form").submit()
            }
        }
    `

    renderReactComponent(
        jsxCode,
        "react-root",
        "TestPage",
        JSON.stringify(js_vars)
    )
}

window.addEventListener("load", () => {
    renderTestPage()
})
