function renderInstructionsPage() {
    const jsxCode = `0
        function InstructionsPage(props){
           return (
                <section>
                    <h4>Instructions</h4>
                    <p>
                        Each box has a value by which the number of items in the box is multiplied
                        (the box’ <b>multiplication rate</b>). One player (the “Hider”) chooses how
                        to distribute the items across the boxes before a second player (the
                        “Opener”) chooses <b>{props.boxes_to_open}</b> {props.boxes_to_open > 1 ? "boxes" : "box"} to open. Openers get the items from
                        the {props.boxes_to_open > 1 ? "boxes" : "box"} they chose to open (multiplied by each box’s multiplication rate), and Hiders get the
                        items from the unopened remaining {props.boxes_to_open === 2 && props.num_boxes === 3 ? "box" : "boxes"} (multiplied by the boxes’ multiplication rate).
                    </p>
                    <p>
                        You will be assigned either the role of Hider or Opener and play the game
                        four times with different sets of boxes.  
                    </p>
                    <p>
                        For each of the four problems, once you indicate how you’d like to allocate the items (if you are a hider)
                        or which boxes to open (if you are an opener). You will be randomly matched with another participant
                        fulfilling the complementary role. The boxes indicated by the opener will be opened, and the value of
                        items in the opened and unopened boxes will be added to the credit of the opener and the hider,
                        respectively. Each point is worth half a penny (i.e., each 200 points are worth 1 GBP). The bonus
                        payment will be added to your participation fee of 2 GBP. You will be informed of the bonus shortly
                        after having completed all four problems.
                    </p>
                    <p>
                        Prior to the game, you will be shown a simple test of 3 questions to ensure
                        you understood the game and the way credit is computed. You will get two chances to answer each question correctly. However, if
                        you answer any of the 3 questions incorrectly twice, your participation will be terminated.
                        Click &quot;Proceed&quot; when you are ready to start the test.
                    </p>
                    <div class="button-container">
                        <button class="btn btn-primary">Proceed</button>
                    </div>
                </section>
           )
        }
    `
    renderReactComponent(
        jsxCode,
        "react-root",
        "InstructionsPage",
        JSON.stringify(js_vars)
    );
}

window.addEventListener("load", renderInstructionsPage);
