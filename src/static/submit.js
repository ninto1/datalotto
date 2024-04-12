async function main() {
    function checkWebGLSupport() {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (gl && gl instanceof WebGLRenderingContext) {
            return true;
        } else {
            return false;
        }
    }

    let ticketnum = null
    let data = {}
    if (document.cookie.includes("ticket")) {
        ticketnum = document.cookie.split("; ").filter(s => {
            return s.includes("ticket")
        })[0].split("=")[1]
    } else {
        data.touch = (navigator.maxTouchPoints > 0)
        data.width = screen.width
        data.height = screen.height
        let nVer = navigator.appVersion;
        let nAgt = navigator.userAgent;
        let browser = navigator.appName;
        let version = "" + parseFloat(nVer);
        let nameOffset, verOffset, ix;

        // Yandex Browser
        if ((verOffset = nAgt.indexOf("YaBrowser")) != -1) {
            browser = "Yandex";
            version = nAgt.substring(verOffset + 10);
        }
        // Samsung Browser
        else if ((verOffset = nAgt.indexOf("SamsungBrowser")) != -1) {
            browser = "Samsung";
            version = nAgt.substring(verOffset + 15);
        }
        // UC Browser
        else if ((verOffset = nAgt.indexOf("UCBrowser")) != -1) {
            browser = "UC Browser";
            version = nAgt.substring(verOffset + 10);
        }
        // Opera Next
        else if ((verOffset = nAgt.indexOf("OPR")) != -1) {
            browser = "Opera";
            version = nAgt.substring(verOffset + 4);
        }
        // Opera
        else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browser = "Opera";
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Legacy Edge
        else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
            browser = "Microsoft Legacy Edge";
            version = nAgt.substring(verOffset + 5);
        }
        // Edge (Chromium)
        else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
            browser = "Microsoft Edge";
            version = nAgt.substring(verOffset + 4);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browser = "Microsoft Internet Explorer";
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browser = "Chrome";
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browser = "Safari";
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browser = "Firefox";
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf("Trident/") != -1) {
            browser = "Microsoft Internet Explorer";
            version = nAgt.substring(nAgt.indexOf("rv:") + 3);
        }
        // Other browsers
        else if (
            (nameOffset = nAgt.lastIndexOf(" ") + 1) <
            (verOffset = nAgt.lastIndexOf("/"))
        ) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(";")) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(" ")) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(")")) != -1) version = version.substring(0, ix);

        majorVersion = parseInt("" + version, 10);
        if (isNaN(majorVersion)) {
            version = "" + parseFloat(nVer);
            majorVersion = parseInt(nVer, 10);
        }

        // system
        let os = unknown;
        let clientStrings = [
            {s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/},
            {s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/},
            {s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/},
            {s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/},
            {s: "Windows Vista", r: /Windows NT 6.0/},
            {s: "Windows Server 2003", r: /Windows NT 5.2/},
            {s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/},
            {s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/},
            {s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/},
            {s: "Windows 98", r: /(Windows 98|Win98)/},
            {s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/},
            {
                s: "Windows NT 4.0",
                r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
            },
            {s: "Windows CE", r: /Windows CE/},
            {s: "Windows 3.11", r: /Win16/},
            {s: "Android", r: /Android/},
            {s: "Open BSD", r: /OpenBSD/},
            {s: "Sun OS", r: /SunOS/},
            {s: "Chrome OS", r: /CrOS/},
            {s: "Linux", r: /(Linux|X11(?!.*CrOS))/},
            {s: "iOS", r: /(iPhone|iPad|iPod)/},
            {s: "Mac OS X", r: /Mac OS X/},
            {s: "Mac OS", r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s: "QNX", r: /QNX/},
            {s: "UNIX", r: /UNIX/},
            {s: "BeOS", r: /BeOS/},
            {s: "OS/2", r: /OS\/2/},
            {
                s: "Search Bot",
                r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
            },
        ];
        for (let id in clientStrings) {
            let cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        let osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = "Windows";
        }

        switch (os) {
            case "Mac OS":
            case "Mac OS X":
            case "Android":
                osVersion =
                    /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(
                        nAgt
                    )[1];
                break;

            case "iOS":
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion =
                    osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
                break;
        }
        data.os = os
        data.browser = browser + " " + version
        data.cookies = document.cookie
        data.webGL = checkWebGLSupport()
        navigator.getBattery()
            .then(battery => {

                if (battery && battery.level !== undefined) {
                    data.battery = Math.floor(battery.level * 100)
                } else {
                    console.log("Battery level information not available.");
                }
            })
            .catch(error => {
                console.error("Error getting battery information:", error);
            });
        fetch("/api/submit", {method: "POST", body: JSON.stringify(data)}).then(res=>{
            res.json().then(dat=>{
                console.log(dat)
                document.getElementById("submStat").innerText="Your ticket number is "+dat.ticket+".\n Go get your physical ticket in the Cisco Lab!"
            })
        })
    }
}
