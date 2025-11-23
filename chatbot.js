(function () {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args) => {
            if (!window.chatbase.q) { window.chatbase.q = [] }
            window.chatbase.q.push(args)
        };
        window.chatbase = new Proxy(window.chatbase, {
            get(target, prop) {
                if (prop === "q") { return target.q }
                return (...a) => target(prop, ...a)
            }
        })
    }
    const onLoad = function () {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "ZpkVlMr94rMHgyLpuyj8c";  // Your Chatbase bot ID
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
    };
    if (document.readyState === "complete") { onLoad(); }
    else { window.addEventListener("load", onLoad); }
})();
