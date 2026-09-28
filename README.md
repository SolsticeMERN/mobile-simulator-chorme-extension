# 📱 Mobile Responsive Simulator - Chrome & Edge Extension (Manifest V3)

> **Test the mobile version of any website across 81+ real-world devices, compare multiple breakpoints side-by-side, simulate touch gestures, export transparent PNG mockups, and record video demos — all in one click.**

Compatible with **Google Chrome**, **Microsoft Edge**, **Brave**, **Opera**, and any Chromium-based browser.

---

## ✨ Features Overview

- **81+ Pre-Configured Devices**:
  - **66 Smartphones**: Apple iPhone 18 Pro Max, 18 Pro, iPhone Duo, 16 Pro Max, 16 Pro, 16, 15 Pro, 14, 13 mini, SE, Galaxy S26 Ultra, S24 Ultra, Pixel 10 Fold, Pixel 9 Pro XL, Xiaomi 14 Pro, OnePlus 12, Motorola Razr 70 Ultra, and more.
  - **5 Tablets**: iPad Pro 12.9", iPad Pro 11", iPad Air, iPad Mini, Galaxy Tab S9 Ultra, Surface Pro 9.
  - **9 Desktops & Displays**: MacBook Neo 2026, MacBook Pro 16", MacBook Air 13", iMac 24", 4K UHD, QHD 2K, 1080p, Standard Laptop, and Interactive Kiosk.
  - **4 Smartwatches**: Apple Watch Ultra 2, Apple Watch Series 9, Pixel Watch 2, Galaxy Watch 6.
- **Ultra-Realistic Device Mockups**: Dynamic Island, camera punch-holes, curved corners, titanium borders, home bars, and a 1-click toggle for clean/frameless mode.
- **Header Bypass via Manifest V3 `declarativeNetRequest`**: Seamlessly bypasses `X-Frame-Options: SAMEORIGIN/DENY` and CSP `frame-ancestors` restrictions, allowing you to simulate **any** website (localhost, staging, production, GitHub, Shopify, etc.).
- **Multi-Device Comparison (Side-by-Side)**: Test multiple devices at once with shared URL navigation and synchronized scrolling.
- **Touch Gestures & Inertia Scrolling**: Circle touch pointer cursor and natural drag-to-scroll with physics decay.
- **Media Exports**:
  - **Transparent PNG Mockups**: Export high-definition device mockups with transparent backgrounds for client slides or Figma.
  - **Clean Viewport Screenshots**: 1-click capture of the simulated page.
  - **Screen Video Recording**: Record your testing session directly to `.webm` video with one click.
- **Custom Device Creator**: Build and save your own custom device profiles with custom resolution, DPR, and User-Agent.
- **QR Code Testing**: Generate an instant QR code to open the tested URL on your physical phone on the same Wi-Fi.
- **Localhost & Staging Ready**: Works seamlessly on `localhost:3000`, `127.0.0.1`, `http://`, and `https://`.

---

## 🚀 How to Install & Test Locally (Load Unpacked)

You can load and test this extension in your browser right now in less than 30 seconds:

1. Open **Google Chrome** (or Edge/Brave).
2. Navigate to:
   ```text
   chrome://extensions
   ```
3. In the top right corner, turn **ON** the **Developer mode** toggle.
4. Click the **"Load unpacked"** button in the top left.
5. In the file picker, select this project folder:
   ```text
   /Users/shakilsarker/Desktop/Simulator chorme extension
   ```
6. The extension **"Mobile Responsive Simulator - Multi-Device Tester"** is now installed!
7. Pin the extension icon to your browser toolbar for instant 1-click access.

---

## 🎯 How to Use (Instant 1-Click Workflow)

### 1. Instant 1-Click Simulation
- Visit **any website** or local server (e.g. `http://localhost:3000`, `https://github.com`, `https://apple.com`).
- Simply **click the Mobile Simulator icon** in your browser toolbar!
- It **automatically detects the current website's URL** and instantly switches to the mobile simulator view with that page loaded inside the realistic device mockup — **zero manual typing, zero popup steps!**

### 2. Instant 1-Click Return to Desktop
- When you want to return to the normal desktop view, simply **click the extension toolbar icon again** or click the **"🖥️ Desktop View"** button in the simulator top bar!

### 3. Switch Devices & Orientations
- Click the **Device Picker** button in the top navigation bar to open the 81+ device catalog.
- Filter by brand (Apple, Samsung, Google, Tablets, Desktops, Watches) or search by name/resolution.
- Click the **🔄 Rotate** button to switch between Portrait and Landscape orientations.
- Click the **🖼️ Mockup** button to toggle between realistic hardware bezels and clean frameless mode.

### 4. Multi-Device Comparison
- Click the **🗂️ Multi-Device** button in the top bar.
- Compare breakpoints side-by-side (e.g., iPhone 16 Pro, Galaxy S24 Ultra, iPad Pro, and MacBook Air).
- Click **"+ Add Device"** to add additional devices to the comparison row.
- Any URL entered in the top address bar updates all devices simultaneously!

### 5. Export Mockups & Record Video Demos
- Click **📷** to export a transparent PNG screenshot of the device mockup.
- Click **🎥** to start a video recording of your interaction and click again to download the `.webm` video.
- Click **📱** to display a QR code for quick scanning on your real smartphone.

---

## 📦 How to Publish to the Chrome Web Store

The project is pre-configured and 100% compliant with **Manifest V3** and the **Chrome Web Store Developer Program Policies**.

### Step 1: Generate the Production Zip File
Run this command in the project directory:
```bash
npm run build:zip
```
This generates the clean, store-ready upload package:
```text
dist/mobile-simulator-v1.0.0.zip
```

### Step 2: Upload to Chrome Web Store
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Click **"New Item"**.
3. Drag and drop the generated `dist/mobile-simulator-v1.0.0.zip` file.
4. Fill in the listing details using the pre-written copy in [`STORE_LISTING.md`](STORE_LISTING.md):
   - **Title**: `Mobile Responsive Simulator - Multi-Device Tester`
   - **Summary**: Copy from `STORE_LISTING.md`
   - **Detailed Description**: Copy and paste the formatted markdown/text from `STORE_LISTING.md`
   - **Category**: `Developer Tools`
5. In the **Privacy** tab:
   - Paste the contents or link of [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md).
   - Under Single Purpose: Select *"Responsive web design testing and multi-device simulation."*
   - Under Permission Justifications:
     - `declarativeNetRequest`: To remove X-Frame-Options from embedded test frames.
     - `activeTab`: To detect active tab URL upon user clicking the extension icon.
     - `storage`: To save local device preferences and custom devices.
6. Upload 1 to 5 promo screenshots (1280×800 px) showing the simulator in action.
7. Click **"Submit for Review"**!

---

## 📁 Project File Structure

```text
Simulator chorme extension/
├── manifest.json                  # Manifest V3 extension configuration
├── background/
│   └── service_worker.js         # Background worker: handles tabs, clicks, context menus
├── rules/
│   └── dnr-rules.json             # declarativeNetRequest rules for X-Frame-Options bypass
├── popup/
│   ├── popup.html                 # Quick-launch toolbar popup
│   ├── popup.css                  # Popup modern dark styling
│   └── popup.js                   # Launch simulator for current tab
├── simulator/
│   ├── index.html                 # Main Simulator Studio interface
│   ├── css/
│   │   ├── simulator.css          # Studio layout, toolbar, workspace, modals
│   │   ├── devices.css            # Realistic device hardware frames (CSS/SVG)
│   │   └── theme.css              # Dark & light design system tokens
│   ├── js/
│   │   ├── devices-db.js          # Catalog of 81+ pre-configured devices
│   │   ├── simulator-core.js      # Viewport scaling, iframe lifecycle, rotate, zoom
│   │   ├── multi-device.js        # Multi-device side-by-side manager
│   │   ├── touch-emulator.js      # Touch cursor & drag inertia simulation
│   │   ├── media-export.js        # Screenshot export & WebM video recorder
│   │   ├── custom-devices.js      # Custom device creator & storage
│   │   ├── qrcode.min.js          # QR code generator for phone testing
│   │   └── app.js                 # Simulator app entry point
├── icons/                         # 16x16, 32x32, 48x48, 128x128 PNG & master SVG
├── dist/
│   └── mobile-simulator-v1.0.0.zip # Chrome Web Store ready package
├── STORE_LISTING.md               # Ready-to-copy Chrome Web Store listing metadata
├── PRIVACY_POLICY.md              # Privacy policy required by Chrome Web Store
├── package.json                   # Build and validation scripts
└── README.md                      # Documentation & instructions
```
