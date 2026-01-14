function renderInstructionsPage() {
    const jsxCode = `
        const pages = (props) => [
            <section>
                <p>
                    Now that you have passed the test the game proceeds as follows:
                </p>
                <p>
                    If you are a Hider, you will hide items in four sets of <b>{props.num_boxes}</b> boxes.<br/>
                    If you are an Opener, you will see the same four sets of {props.num_boxes} boxes, and in each set choose <b>{props.boxes_to_open}</b> boxes to opened later.
                </p>
                <p>
                    You will then be randomly matched with an opponent of the other role.
                    For each of the sets, the boxes chosen by the opener, will be opened,
                    and your bonus will be calculated based on the value of the items in the boxes
                    you get (either those chosen by the Opener or those left for the Hider).
                    The value of each point is ½ a penny.
                    <br/>
                    Each object is worth {js_vars.real_world_currency_per_point} Pence.
                </p>
            </section>,

            <section>
                {props.role === "hider" && (
                    <p>
                        You are a <b>Hider</b>. In each set of boxes you need to hide all of your itemss.
                        To indicate how many items
                        you want to hide in a box, click on it and write the number. The number chosen will appear in the box,
                        and the value of those items (number of items times the multiplication value of the box) will appear
                        under the box. The number of items still not allocated to any of the boxes will appear on the left. Once
                        all items have been allocated you can submit that allocation. You can hide anywhere between zero and
                        all of your items in a box. The multiplication rate of each box is indicated under it, and the
                        items hidden there are multiplied by this rate. Remember, the value of the items in the boxes
                        not chosen by your matched Opener will be yours.
                    </p>
                )}

                {props.role === "seeker" && (
                    <p>
                        You are an Opener. In each set of boxes you need to choose which {props.boxes_to_open} of the {props.num_boxes} boxes to open.
                        The multiplication rate of each box is indicated under it, and the items hidden there are
                        multiplied by this rate. These boxes will later be opened and the items in them will be yours;
                        objects in the remaining boxes will be the Hider’s.
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
