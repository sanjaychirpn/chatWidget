// import cors from "cors";
(() => {
    const script = document.currentScript;
    // cors({origin: "*"})
    const loadWidget = () => {
        
        const widget= document.createElement("div");

        const widgetStyle = widget.style;
        widgetStyle.display = "none";
        widgetStyle.boxSizing = "border-box";
        widgetStyle.width = "500px";    
        widgetStyle.height = "600px";
        widgetStyle.position = "absolute";
        widgetStyle.top = "40px";
        widgetStyle.right = "500px";

        const iframe = document.createElement("iframe");

        const iframeStyle = iframe.style;
        iframeStyle.boxSizing = "borderBox";
        // iframeStyle.position = "absolute";
        iframeStyle.right = 0;
        iframeStyle.top = 0;
        iframeStyle.width = "100%";
        iframeStyle.height = "100%";
        iframeStyle.border = 0;
        iframeStyle.margin = 0;
        iframeStyle.padding = 0;

        widget.appendChild(iframe);
        
        iframe.addEventListener("load", () => widgetStyle.display = "block" );
        
        const license = script.getAttribute("data-license");
        const widgetUrl = `http://localhost:5000?license=${license}`;
        const greeting = script.getAttribute("data-greeting");
        
        iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage({greeting}, "http://localhost:5000");
            widgetStyle.display = "block";
         });
        
        iframe.src = widgetUrl;

        document.body.appendChild(widget);
        
    }
    
    if ( document.readyState === "complete" ) {
        loadWidget();
    } else {
        document.addEventListener("readystatechange", () => {
            if ( document.readyState === "complete" ) {
                loadWidget();
            }
        });
    }

})();