function renderExitPage(){
    const jsxCode = `
        const { useEffect } = React;

        function ExitPage(props){
            let redirectUrl = "";
            let message = "";

            // Logic to determine URL and Message
            if (!props.userAcceptedTerms){
                redirectUrl = "https://app.prolific.com/submissions/complete?cc=CPIYJGE6";
                message = "Thank you for your interest. You did not accept the terms, please return your hit.";
            } else if (props.endedSuccessfully){
                redirectUrl = "https://app.prolific.com/submissions/complete?cc=CGIVAQNE";
                message = "You have successfully completed the study. Thank you!";
            } else {
                redirectUrl = "https://app.prolific.com/submissions/complete?cc=C898AXUN";
                message = "You did not complete the study successfully. Please return your hit.";
            }

            // The Auto-Redirect Logic
            useEffect(() => {
                const timer = setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 3000); // 3 seconds delay

                return () => clearTimeout(timer); // Cleanup timer if component unmounts
            }, [redirectUrl]);

            return (
                <p>
                    {message}<br/>
                    Redirecting you to Prolific in 3 seconds...<br/>
                    <a href={redirectUrl}>Click here if you are not redirected automatically.</a>
                </p>
            );
        }
    `
    renderReactComponent(jsxCode, "react-root", "ExitPage", JSON.stringify(js_vars));
}

window.addEventListener("load", ()=>{
    renderExitPage()
})