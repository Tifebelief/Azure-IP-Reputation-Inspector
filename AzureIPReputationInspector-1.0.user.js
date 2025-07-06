// ==UserScript==
// @name         Azure IP Reputation Inspector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Azure Portal IP Checker using AbuseIPDB & VPN checks(IPQualityScore). API keys securely stored, prompted once after 30-sec delay on first run.
// @author       Boluwatife Ajao
// @match        https://portal.azure.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.abuseipdb.com
// @connect      ipqualityscore.com
// ==/UserScript==

(function() {
    'use strict';

    function getStoredApiKey(storageKey, friendlyName){
        let key = localStorage.getItem(storageKey);
        if (!key || key === 'null'){
            key = prompt(`🔑 Please explicitly enter your ${friendlyName} API key:`);
            if(key){
                localStorage.setItem(storageKey, key.trim());
                alert(`✅ ${friendlyName} API key securely saved.`);
                return key.trim();
            } else {
                alert(`❌ ${friendlyName} API key explicitly required.`);
                throw new Error(`${friendlyName} key required.`);
            }
        }
        return key;
    }

    function defang(ip){ return ip.replace(/\./g,'[.]').replace(/:/g,'[:]'); }
    function isValidIPv4(ip){return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);}
    function isValidIPv6(ip){return /^[a-fA-F0-9:]+$/.test(ip);}

    function isPrivateIP(ip){
        if(isValidIPv4(ip)){
            const p=ip.split('.').map(Number);
            return p[0]==10||p[0]==127||(p[0]==172&&p[1]>=16&&p[1]<=31)||(p[0]==192&&p[1]==168);
        }
        if(isValidIPv6(ip)){
            return ip.startsWith('fe80:')||ip.startsWith('fc00:')||ip.startsWith('fd00:')||ip==='::1';
        }
        return false;
    }

    function createPanel(){
        if(document.getElementById("secureIPCheckPanel"))return;
        let h=`
        <div id='secureIPCheckPanel' style='position:fixed;top:70px;right:20px;width:370px;background:#ffffff;padding:10px;border-radius:7px;box-shadow:0 4px 8px rgba(0,0,0,0.25);z-index:9999;display:none;font-family:sans-serif;'>
            <div style='font-weight:bold;color:#0078D4;margin-bottom:6px;'>🔍 IP Reputation Lookup</div>
            <input id='ipInputBox' placeholder='Paste IPv4/IPv6 IP explicitly...' style='width:100%;padding:5px;border-radius:4px;border:1px solid gray;margin-bottom:6px;'>
            <button id='ipCheckBtn' style='width:100%;padding:6px;background:#0078D4;color:white;border:none;border-radius:4px;cursor:pointer;'>Check IP Reputation</button>
            <button id='resetApiKeysBtn' style='margin-top:5px;width:100%;padding:5px;border-radius:4px;border:none;background:#d83b01;color:white;cursor:pointer;'>🔄 Reset API Keys</button>
            <pre id='ipResultOutput' style='margin-top:8px;color:#000;font-size:11px;white-space:pre-wrap;'></pre>
        </div>
        <button id='panelToggleBtn' style='position:fixed;top:70px;right:20px;padding:8px;background:#0078D4;color:white;border-radius:50%;border:none;cursor:pointer;z-index:9999;'>🕵️‍♂️</button>`;
        document.body.insertAdjacentHTML('beforeend',h);

        document.getElementById('panelToggleBtn').onclick=()=>{
            let panel=document.getElementById('secureIPCheckPanel');
            panel.style.display=panel.style.display==='none'?'block':'none';
        };

        document.getElementById('ipCheckBtn').onclick=checkIPDetails;
        document.getElementById('ipInputBox').onfocus=()=>{
            document.getElementById('ipInputBox').value='';
            document.getElementById('ipResultOutput').innerHTML='';
        };

        document.getElementById('resetApiKeysBtn').onclick = ()=>{
            const confirmReset = confirm('⚠️ Explicitly reset BOTH API Keys? You must re-enter them explicitly again after reload.');
            if(confirmReset){
                localStorage.setItem('abuseipdb_api_key', null);
                localStorage.setItem('ipqualityscore_api_key', null);
                alert('✅ API Keys explicitly cleared. Refreshing now.');
                location.reload();
            }
        };
    }

    function checkIPDetails(){
        let ip=document.getElementById('ipInputBox').value.trim();
        let res=document.getElementById('ipResultOutput');
        if(!isValidIPv4(ip)&&!isValidIPv6(ip)){
            res.textContent='❌ Invalid IP.';
            res.style.color='red';return;
        }
        if(isPrivateIP(ip)){
            res.textContent=`⚠️ Private IP ${defang(ip)} detected explicitly. No check done.`;
            res.style.color='#0078D4';return;
        }
        res.textContent='🔍 Checking AbuseIPDB & VPN explicitly...';

        GM_xmlhttpRequest({
            method:'GET',
            url:`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose=true`,
            headers:{'Accept':'application/json','Key':ABUSEIPDB_KEY},
            onload:r1=>{
                let abuse=JSON.parse(r1.responseText).data;
                GM_xmlhttpRequest({
                    method:'GET',
                    url:`https://ipqualityscore.com/api/json/ip/${IPQUALITYSCORE_KEY}/${ip}`,
                    headers:{'Accept':'application/json'},
                    onload:r2=>{
                        let vpn=JSON.parse(r2.responseText);
                        const vpnDetails=(vpn.vpn||vpn.proxy||vpn.tor)?`🚨 VPN/Proxy detected!
- VPN:${vpn.vpn} | Proxy:${vpn.proxy} | Tor:${vpn.tor}
- FraudScore:${vpn.fraud_score}%`:`✅No VPN/Proxy/Tor detected.`;

                        res.textContent=`
IP Address Reputation:
──────────────────────
IP Address      : ${defang(abuse.ipAddress)}
ConfidenceScore : ${abuse.abuseConfidenceScore}
Country         : ${abuse.countryName} (${abuse.countryCode})
ISP             : ${abuse.isp}
Domain          : ${abuse.domain||'N/A'}
Total Reports   : ${abuse.totalReports}
Last Reported   : ${abuse.lastReportedAt||'Never'}
Whitelisted     : ${abuse.isWhitelisted}

${abuse.totalReports>0?`⚠️ ${abuse.ipAddress}(Score:${abuse.abuseConfidenceScore},Reports:${abuse.totalReports})`:'✅No reports found'}

VPN/Proxy Information:
──────────────────────
${vpnDetails}
Organization: ${vpn.organization||'N/A'}
Hostname: ${vpn.host||'N/A'}`;
                        res.style.color=(abuse.abuseConfidenceScore>50||vpn.fraud_score>80)?'red':(abuse.abuseConfidenceScore>0||vpn.fraud_score>40)?'orange':'green';
                    },
                    onerror:()=>{res.textContent='❌ IPQualityScore Error.';res.style.color='red';}
                });
            },
            onerror:()=>{res.textContent='❌ AbuseIPDB Error.';res.style.color='red';}
        });
    }

    setTimeout(() => {
        try {
            window.ABUSEIPDB_KEY = getStoredApiKey('abuseipdb_api_key', 'AbuseIPDB');
            window.IPQUALITYSCORE_KEY = getStoredApiKey('ipqualityscore_api_key', 'IPQualityScore');
            createPanel();
        } catch (error) {
            console.log(error.message);
        }
    }, 30000); // Explicit 30-sec delay from page load, prompts keys sequentially once
})();