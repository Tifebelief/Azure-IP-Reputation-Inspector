# 🕵️‍♂️ Azure-IP-Reputation-Inspector 

This practical, customizable userscript streamlines and accelerates the IP reputation look up process for security analysts. This tool simplifies the process of checking IP addresses against trusted reputation and fraud-detection databases like AbuseIPDB and IPQualityScore, helping you quickly determine if an IP address is malicious, part of a VPN/proxy/Tor network, or generally suspicious.

Designed explicitly with flexibility in mind, the script can easily incorporate additional OSINT data sources. Although initially built for the Azure Portal, it can also be customized or expanded into a standalone browser addon, enabling broader functionality across different web platforms and security workflows according to analysts' specific needs.

---

## 📌 Features

- **Integrated IP Reputation Checks:** Quickly verify the reputation and trustworthiness of any IPv4 or IPv6 address from within Azure Portal.
- **Comprehensive Reporting:** Provides detailed information about IP addresses including ISP, geographic location, VPN/proxy detection, fraud score, and past abuse reports.
- **Interactive Interface:** A compact and intuitive sidebar panel that can be toggled to quickly input IP addresses and inspect results.
- **Secure API Key Management:** Your API keys for AbuseIPDB and IPQualityScore services are securely stored in your browser’s local storage and are prompted once explicitly (on first run, after a 30-second delay from first execution).
- **Convenient "Defanging":** IP addresses displayed in your results use defanging notation (e.g., `192[.]168[.]0[.]1`) to safely share reports.

---

## ⚙️ Requirements

To use this user script, you need:

- **Browser Compatibility**:
  - Google Chrome, Mozilla Firefox, Microsoft Edge, or any modern browser capable of supporting browser userscripts.
- A userscript manager extension:
  - **Tampermonkey** ([Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/))
- Active accounts (free or paid) for the following reputation-checking APIs (used by the script):
  - **[AbuseIPDB](https://www.abuseipdb.com/)** account and API key to check abuse and malicious IP reports.
  - **[IPQualityScore](https://www.ipqualityscore.com/)** account and API key to detect VPN/proxy usage, fraud scores, TOR activity, and more.
- **Access to Azure Portal**:
  - Ability to log in to **[Azure Portal]( https://portal.azure.com)**


*Note: Both services offer free API usage tiers that should suffice for average daily checks.

---

## 🚀 Installation Instructions

1. **Install Tampermonkey:**  
   - Visit the [Tampermonkey website](https://www.tampermonkey.net/) and install the extension for your browser.

2. **Add the UserScript:**  
   - Open the Tampermonkey browser extension.
   - Create a new script and paste the provided UserScript code or directly import the downloaded `AzureIPReputationInspector-1.0.user.js` file.

3. **Configure API keys:**  
   - After visiting [Azure Portal](https://portal.azure.com/) **for the first time after installation, your script will prompt you explicitly once (after about a 30-second delay)** to enter your API keys.  
   - Provide your AbuseIPDB and IPQualityScore API keys when prompted explicitly to securely save them in the local browser storage. They will remain stored securely locally thereafter.

---

## 🧑‍💻 How to Use

- Once inside [Azure Portal](https://portal.azure.com/), look to the top right corner. Click on the 🕵️‍♂️ icon to toggle the IP Reputation Inspector.
- Paste or explicitly type an IPv4/IPv6 address into the text input box and click **"Check IP Reputation"**.
- You will get a detailed report about the IP, displaying information such as:
  - Abuse confidence score & total abuse reports
  - Country information and ISP
  - VPN/Proxy/Tor detection status from IPQualityScore
  - Fraud scores and other related details
- IP addresses recognized explicitly as private or local addresses (for example, `192.168.x.x`, `10.x.x.x`, or `127.0.0.1`) will not generate external requests but will immediately be flagged as "Private IP".

---

## 🔑 Resetting your API Keys

- If you need to explicitly remove or update API keys (e.g., after key expiry or credential change), use the **"Reset API Keys"** button in the inspector panel. Your keys will be cleared and you will be asked explicitly again for new ones on next reload.

---

## 📝 Script Structure & Permissions Explained

The script explicitly declares the following permissions and integrations in accordance with best practices:

- **Matches URL:** Only runs explicitly on Azure Portal pages (`https://portal.azure.com/*`).
- **API integrations:** Explicitly connects to AbuseIPDB and IPQualityScore endpoints for IP checks.
- **Data Handling:** Your API keys are explicitly never transmitted outside normal operation and stored securely in your browser’s local storage only.

---

## ⚠️ Important Security Notice

- **Never publicly share your API keys.**
- **Always verify code you execute via Tampermonkey/UserScripts explicitly.**
- **Ensure you trust the sources before explicitly inputting API keys or credentials.**

---

## 👨‍💻 Author

Developed by **Boluwatife Ajao**.

Feel free to contribute ideas, provide feedback or report issues by contacting the author directly or opening an issue on GitHub.

---

## 📃 License

This project/script is provided as-is. Please ensure compliance with both AbuseIPDB's and IPQualityScore's usage terms or policies when using their APIs.

---

## 🛡️ Disclaimer

This project explicitly uses third-party reputation databases for informational purposes. The script’s author explicitly cannot guarantee full accuracy of the provided reputation or fraud detection data. Use results as an aid, not an absolute definitive judgement, and always conduct further validation using additional cybersecurity practices and analyses.

---

**Happy Triaging! 🛡️✨**



