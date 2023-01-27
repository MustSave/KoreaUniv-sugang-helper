import puppeteer, {Page, Target, Frame} from "puppeteer"

(async ()=>{
    const browser = await puppeteer.launch({headless:false, defaultViewport: null});

    browser.pages().then(pages=>{
        pages.forEach(registListener)
    })

    browser.on('targetcreated',(target:Target)=>{
        target?.page().then(page=>{
            registListener(page)
        })
    })

    const evaluate = (frame:Frame) =>{
        frame.waitForFunction('typeof NetFunnel !== "undefined"', {polling: 'mutation', timeout: 10000})
        .then(()=>{
            frame.evaluate(()=>{
                window['NetFunnel'].TS_BYPASS = true;
                console.log("Successfully bypassed NetFunnel")
            })
        }).catch(console.log)
    }

    const registListener = (page:Page)=>{
        if (!page) return

        page.setRequestInterception(true).then(()=>{
            page.on('request', req=>{
                if (req.resourceType() === 'document' && req.url().includes('sugang.korea')) {
                    page.setCookie({name: 'popNotice', value: 'Y', domain: 'sugang.korea.ac.kr'})
                }
                if (req.resourceType() === 'script' && req.url().includes('duplicate')) req.respond({
                    status: 200,
                    contentType: 'application/x-javascript',
                    body: bypassDup
                })
                else req.continue()
            })
        })

        page.on('load', ev=>{
            page.frames().forEach(evaluate)
        })
    }
    browser.pages().then(p=>{p[0].goto("https://sugang.korea.ac.kr")})
})()

const bypassDup = `(function ($) {
    $.fn.DuplicateWindow = function () {
        var localStorageTimeout = (5) * 1000;
        var localStorageResetInterval = (1/2) * 1000;
        var localStorageTabKey = 'my-application-browser-tab';
        var sessionStorageGuidKey = 'browser-tab-guid';

        var ItemType = {
            Session: 1,
            Local: 2
        };

        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }
        function getCookie(name) {
           var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function GetItem(itemtype) {
            var val = "";
            switch (itemtype) {
                case ItemType.Session:
                    val = window.name;
                    break;
                case ItemType.Local:
                    val = decodeURIComponent(getCookie(localStorageTabKey));
                    if (val == undefined)
                        val = "";
                    break;
            }
            return val;
        }

        function SetItem(itemtype, val) {
            switch (itemtype) {
                case ItemType.Session:
                    window.name = val;
                    break;
                case ItemType.Local:
                    setCookie(localStorageTabKey, val);
                    break;
            }
        }

        function createGUID() {
            this.s4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            };
            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
        }

        function TestIfDuplicate() {
            var sessionGuid = GetItem(ItemType.Session) || createGUID(); 
            SetItem(ItemType.Session, sessionGuid);
            return false
        }

        window.IsDuplicate = function () {
            return (TestIfDuplicate() == true ? "warning" : "login");
        };
        
    }
    $(window).DuplicateWindow();
}(jQuery));
`