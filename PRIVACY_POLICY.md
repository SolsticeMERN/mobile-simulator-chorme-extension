# Privacy Policy - Mobile Responsive Simulator

**Last Updated**: September 15, 2026

This Privacy Policy explains how the **Mobile Responsive Simulator** browser extension ("we", "our", or "the extension") handles user information and data.

---

## 1. Single Purpose Description
The sole purpose of Mobile Responsive Simulator is to provide web developers, designers, and testers with responsive viewport simulation, multi-device comparison, device mockups, and client presentation tools for web pages loaded in the browser.

## 2. No Data Collection or Transmission
- **No Personal Information**: The extension does not collect, record, or transmit any personally identifiable information (PII) such as names, email addresses, IP addresses, or device IDs.
- **No Browsing History Collected**: We do not monitor, log, track, or transmit your browsing history, visited URLs, or session activity. URLs entered or tested in the simulator are processed entirely within your local browser session.
- **No Passwords or Financial Data**: The extension never reads, stores, or transmits form inputs, login credentials, passwords, cookies, or payment information.
- **No Third-Party Analytics / Ads**: The extension contains no third-party tracking scripts, advertising SDKs, telemetry beacons, or external analytics services.

## 3. Local Storage Usage
The extension uses the Chrome `storage.local` API exclusively to save your local UI preferences on your own machine:
- Default device selection
- Dark / Light theme preference
- Mockup frame toggle state
- User-created custom device specifications (name, resolution, DPR)
- Selected multi-device comparison presets

This data remains strictly on your local device and is never synchronized or sent to external servers.

## 4. Permissions Disclosure
- `declarativeNetRequest`: Used exclusively to remove frame-embedding restrictions (`X-Frame-Options` and `Content-Security-Policy: frame-ancestors`) on sub-frames loaded inside the simulator, enabling testing on sites that otherwise forbid iframe embedding.
- `tabs` and `activeTab`: Used solely to detect the URL of the active tab when the user clicks "Simulate This Page", so the simulator can open the target URL automatically.
- `storage`: Used to persist local user settings and custom device profiles.
- `<all_urls>` host permission: Necessary for `declarativeNetRequest` to remove `X-Frame-Options` headers across target websites tested in the simulator frames.

## 5. Contact & Questions
If you have any questions or feedback regarding this Privacy Policy, please open an issue on the extension's official repository or contact the developer via the Chrome Web Store support tab.
