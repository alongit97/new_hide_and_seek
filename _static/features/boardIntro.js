function renderInstructionsPage() {
    const jsxCode = `
        const pages = (props) => [
            <section>
                <p>
                    Now that you have passed the test the game proceeds as follows:
                </p>
                <p>
                    If you are a Hider, you will hide items in four sets of <b>{props.num_boxes}</b> boxes.<br/>
                    If you are an Opener, you will see the same four sets of {props.num_boxes} boxes, and in each set choose <b>{props.boxes_to_open}</b> {props.boxes_to_open > 1 ? "boxes" : "box"} to open later.
                </p>
                <p>
                    You will then be randomly matched with an opponent of the other role.
                    For each of the sets, the boxes chosen by the Opener, will be opened,
                    and your bonus will be calculated based on the value of the items in the boxes
                    you get (either {props.boxes_to_open > 1 ? "those" : "that"} chosen by the Opener or {props.boxes_to_open === 2 && props.num_boxes == 3 ? "that" : "those"} left for the Hider).
                    The value of each point is ½ a penny.
                    <br/>
                </p>
            </section>,

            <section>
                {props.role === "hider" && (
                    <p>
                        You are a <b>Hider</b>. In each set of boxes you need to hide all of your items.
                        To indicate how many items
                        you want to hide in a box, click on it and write the number. The number chosen will appear in the box,
                        and the value of those items (number of items times the multiplication value of the box) will appear
                        under the box. The number of items still not allocated to any of the boxes will appear on the left. Once
                        all items have been allocated you can submit that allocation. You can hide anywhere between zero and
                        all of your items in a box. The multiplication rate of each box is indicated under it, and the
                        items hidden there are multiplied by this rate. Remember, the value of the items in the {props.boxes_to_open === 2 && props.num_boxes == 3 ? "box" : "boxes"} not 
                        chosen by your matched Opener will be yours.
                    </p>
                )}

                {props.role === "seeker" && (
                    <p>
                        You are an <b>Opener</b>. In each set of boxes you need to choose which {props.boxes_to_open} of the {props.num_boxes} boxes to open.
                        The multiplication rate of each box is indicated under it, and the items hidden there are
                        multiplied by this rate. {props.boxes_to_open > 1 ? "Those boxes" : "That box"} will later be opened and the items in {props.boxes_to_open > 1 ? "them" : "it"} will be yours;
                        itemss in the remaining boxes will be the Hider’s.
                    </p>
                )}
            </section>,
        ];

        function InstructionsPage(props){
            const [page, setPage] = React.useState(0);
            const allPages = React.useMemo(() => pages(props), [props]);

            function onClick(){
                const nextPage = page + 1;
                if(nextPage === allPages.length){
                    document.querySelector("form").submit();
                } else {
                    setPage(nextPage);
                }
            }

            return (
                <>
                    {allPages[page]}
                    <div className="button-container">
                        <button className="btn btn-primary" type="button" onClick={onClick}>
                            Proceed
                        </button>
                    </div>
                </>
            );
        }
    `;
    renderReactComponent(
        jsxCode,
        "react-root",
        "InstructionsPage",
        JSON.stringify(js_vars)
    );
}

window.addEventListener("load", renderInstructionsPage);
