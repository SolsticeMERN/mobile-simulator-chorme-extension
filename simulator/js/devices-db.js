/**
 * Mobile Responsive Simulator - Devices Database (84+ Pre-configured Devices)
 * Includes CSS resolution (viewport width x height), DPR (pixel ratio), User-Agent,
 * category, frame type for realistic hardware mockups, and brand.
 */

const DEFAULT_DEVICES = [
  // ==================== APPLE SMARTPHONES ====================
  {
    id: 'iphone-18-pro-max',
    name: 'Apple iPhone 18 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 440,
    height: 956,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2026',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-18-pro',
    name: 'Apple iPhone 18 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 402,
    height: 873,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2026',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-duo-folded',
    name: 'Apple iPhone Duo (Folded)',
    brand: 'Apple',
    category: 'mobile',
    width: 466,
    height: 678,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2026',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-duo-unfolded',
    name: 'Apple iPhone Duo (Unfolded)',
    brand: 'Apple',
    category: 'tablet',
    width: 890,
    height: 678,
    dpr: 3.0,
    frameType: 'tablet',
    year: '2026',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-16-pro-max',
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 440,
    height: 956,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2024',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-16-pro',
    name: 'Apple iPhone 16 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 402,
    height: 874,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2024',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-16-plus',
    name: 'Apple iPhone 16 Plus',
    brand: 'Apple',
    category: 'mobile',
    width: 430,
    height: 932,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2024',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-16',
    name: 'Apple iPhone 16',
    brand: 'Apple',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2024',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 430,
    height: 932,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2023',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2023',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-15',
    name: 'Apple iPhone 15',
    brand: 'Apple',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2023',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-14-pro-max',
    name: 'Apple iPhone 14 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 430,
    height: 932,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-14-pro',
    name: 'Apple iPhone 14 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3.0,
    frameType: 'iphone-island',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-14',
    name: 'Apple iPhone 14',
    brand: 'Apple',
    category: 'mobile',
    width: 390,
    height: 844,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-13-pro-max',
    name: 'Apple iPhone 13 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 428,
    height: 926,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2021',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-13-pro',
    name: 'Apple iPhone 13 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 390,
    height: 844,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2021',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-13-mini',
    name: 'Apple iPhone 13 mini',
    brand: 'Apple',
    category: 'mobile',
    width: 375,
    height: 812,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2021',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-12-pro',
    name: 'Apple iPhone 12 Pro',
    brand: 'Apple',
    category: 'mobile',
    width: 390,
    height: 844,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2020',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-12-mini',
    name: 'Apple iPhone 12 mini',
    brand: 'Apple',
    category: 'mobile',
    width: 375,
    height: 812,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2020',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-se-3',
    name: 'Apple iPhone SE (3rd Gen)',
    brand: 'Apple',
    category: 'mobile',
    width: 375,
    height: 667,
    dpr: 2.0,
    frameType: 'iphone-classic',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-11-pro-max',
    name: 'Apple iPhone 11 Pro Max',
    brand: 'Apple',
    category: 'mobile',
    width: 414,
    height: 896,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2019',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-11',
    name: 'Apple iPhone 11',
    brand: 'Apple',
    category: 'mobile',
    width: 414,
    height: 896,
    dpr: 2.0,
    frameType: 'iphone-notch',
    year: '2019',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'iphone-x',
    name: 'Apple iPhone X / XS',
    brand: 'Apple',
    category: 'mobile',
    width: 375,
    height: 812,
    dpr: 3.0,
    frameType: 'iphone-notch',
    year: '2017',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  },
  {
    id: 'iphone-8-plus',
    name: 'Apple iPhone 8 Plus',
    brand: 'Apple',
    category: 'mobile',
    width: 414,
    height: 736,
    dpr: 3.0,
    frameType: 'iphone-classic',
    year: '2017',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  },
  {
    id: 'iphone-8',
    name: 'Apple iPhone 8 / 7',
    brand: 'Apple',
    category: 'mobile',
    width: 375,
    height: 667,
    dpr: 2.0,
    frameType: 'iphone-classic',
    year: '2017',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  },

  // ==================== SAMSUNG SMARTPHONES ====================
  {
    id: 'samsung-s26-ultra',
    name: 'Samsung Galaxy S26 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    width: 412,
    height: 919,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Linux; Android 16; SM-S948B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    width: 384,
    height: 832,
    dpr: 3.75,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s24-plus',
    name: 'Samsung Galaxy S24+',
    brand: 'Samsung',
    category: 'mobile',
    width: 384,
    height: 832,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'mobile',
    width: 360,
    height: 780,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s23-ultra',
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    width: 384,
    height: 824,
    dpr: 3.75,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s22-ultra',
    name: 'Samsung Galaxy S22 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    width: 384,
    height: 824,
    dpr: 3.75,
    frameType: 'samsung-punchhole',
    year: '2022',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-s21',
    name: 'Samsung Galaxy S21 5G',
    brand: 'Samsung',
    category: 'mobile',
    width: 360,
    height: 800,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2021',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-z-fold5-unfolded',
    name: 'Samsung Galaxy Z Fold 5 (Unfolded)',
    brand: 'Samsung',
    category: 'tablet',
    width: 904,
    height: 1155,
    dpr: 2.4,
    frameType: 'tablet',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-F946B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-z-fold5-folded',
    name: 'Samsung Galaxy Z Fold 5 (Cover)',
    brand: 'Samsung',
    category: 'mobile',
    width: 375,
    height: 905,
    dpr: 2.6,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-F946B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-z-flip5',
    name: 'Samsung Galaxy Z Flip 5',
    brand: 'Samsung',
    category: 'mobile',
    width: 412,
    height: 919,
    dpr: 2.625,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-F731B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-a54',
    name: 'Samsung Galaxy A54 5G',
    brand: 'Samsung',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 2.625,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'samsung-note-20-ultra',
    name: 'Samsung Galaxy Note 20 Ultra',
    brand: 'Samsung',
    category: 'mobile',
    width: 412,
    height: 883,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2020',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-N986B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.0.0 Mobile Safari/537.36'
  },

  // ==================== GOOGLE PIXEL ====================
  {
    id: 'pixel-10-pro-fold',
    name: 'Google Pixel 10 Fold (Folded)',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 901,
    dpr: 2.75,
    frameType: 'pixel-pill',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Linux; Android 16; Pixel 10 Pro Fold) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-10-pro',
    name: 'Google Pixel 10 Pro',
    brand: 'Google',
    category: 'mobile',
    width: 410,
    height: 900,
    dpr: 3.0,
    frameType: 'pixel-pill',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Linux; Android 16; Pixel 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 923,
    dpr: 3.5,
    frameType: 'pixel-pill',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 9 Pro XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-9-pro',
    name: 'Google Pixel 9 Pro',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 900,
    dpr: 3.0,
    frameType: 'pixel-pill',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-9',
    name: 'Google Pixel 9',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 924,
    dpr: 2.625,
    frameType: 'pixel-pill',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'mobile',
    width: 448,
    height: 998,
    dpr: 3.0,
    frameType: 'pixel-pill',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 2.625,
    frameType: 'pixel-pill',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-7-pro',
    name: 'Google Pixel 7 Pro',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 892,
    dpr: 3.5,
    frameType: 'pixel-pill',
    year: '2022',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-7a',
    name: 'Google Pixel 7a',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 2.625,
    frameType: 'pixel-pill',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-6a',
    name: 'Google Pixel 6a',
    brand: 'Google',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 2.625,
    frameType: 'pixel-pill',
    year: '2022',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'pixel-fold-unfolded',
    name: 'Google Pixel Fold (Unfolded)',
    brand: 'Google',
    category: 'tablet',
    width: 840,
    height: 704,
    dpr: 2.5,
    frameType: 'tablet',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel Fold) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
  },

  // ==================== MOTOROLA, XIAOMI, ONEPLUS & OTHERS ====================
  {
    id: 'motorola-razr-70-ultra',
    name: 'Motorola Razr 70 Ultra',
    brand: 'Motorola',
    category: 'mobile',
    width: 412,
    height: 919,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Linux; Android 16; moto razr 70 ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'motorola-razr-50-ultra',
    name: 'Motorola Razr 50 Ultra',
    brand: 'Motorola',
    category: 'mobile',
    width: 412,
    height: 892,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; moto razr 50 ultra) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'infinix-hot-70',
    name: 'Infinix Hot 70',
    brand: 'Infinix',
    category: 'mobile',
    width: 360,
    height: 800,
    dpr: 2.0,
    frameType: 'samsung-punchhole',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Infinix Hot 70) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'xiaomi-14-pro',
    name: 'Xiaomi 14 Pro',
    brand: 'Xiaomi',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; 23116PN5BC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'xiaomi-13-ultra',
    name: 'Xiaomi 13 Ultra',
    brand: 'Xiaomi',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; 2304FPN6DC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'mobile',
    width: 450,
    height: 1000,
    dpr: 3.2,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; PJD110) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'oneplus-open-unfolded',
    name: 'OnePlus Open (Unfolded)',
    brand: 'OnePlus',
    category: 'tablet',
    width: 884,
    height: 1104,
    dpr: 2.8,
    frameType: 'tablet',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; CPH2551) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'nothing-phone-2',
    name: 'Nothing Phone (2)',
    brand: 'Nothing',
    category: 'mobile',
    width: 412,
    height: 919,
    dpr: 2.625,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; A065) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'sony-xperia-1-v',
    name: 'Sony Xperia 1 V',
    brand: 'Sony',
    category: 'mobile',
    width: 412,
    height: 960,
    dpr: 3.5,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; XQ-DQ72) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'asus-rog-phone-8',
    name: 'Asus ROG Phone 8',
    brand: 'Asus',
    category: 'mobile',
    width: 393,
    height: 852,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; ASUS_AI2401_A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'huawei-p60-pro',
    name: 'Huawei P60 Pro',
    brand: 'Huawei',
    category: 'mobile',
    width: 412,
    height: 915,
    dpr: 3.0,
    frameType: 'samsung-punchhole',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 12; MNA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.0.0 Mobile Safari/537.36'
  },

  // ==================== TABLETS ====================
  {
    id: 'ipad-10',
    name: 'Apple iPad 10.9" (Tablet MD)',
    brand: 'Apple',
    category: 'tablet',
    width: 768,
    height: 1024,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'foldable-tablet-640',
    name: 'Foldable / Compact Tablet (640 SM)',
    brand: 'Generic',
    category: 'tablet',
    width: 640,
    height: 720,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  },
  {
    id: 'ipad-pro-11',
    name: 'Apple iPad PRO 11" (3rd/4th Gen)',
    brand: 'Apple',
    category: 'tablet',
    width: 834,
    height: 1194,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'ipad-pro-12-9',
    name: 'Apple iPad Pro 12.9" (6th Gen)',
    brand: 'Apple',
    category: 'tablet',
    width: 1024,
    height: 1366,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'ipad-air',
    name: 'Apple iPad Air (5th Gen)',
    brand: 'Apple',
    category: 'tablet',
    width: 820,
    height: 1180,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2022',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'ipad-mini',
    name: 'Apple iPad Mini 6',
    brand: 'Apple',
    category: 'tablet',
    width: 744,
    height: 1133,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2021',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  {
    id: 'samsung-tab-s9-ultra',
    name: 'Samsung Galaxy Tab S9 Ultra',
    brand: 'Samsung',
    category: 'tablet',
    width: 1120,
    height: 1792,
    dpr: 2.5,
    frameType: 'tablet',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-X910) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  },
  {
    id: 'samsung-tab-s9',
    name: 'Samsung Galaxy Tab S9',
    brand: 'Samsung',
    category: 'tablet',
    width: 800,
    height: 1280,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  },
  {
    id: 'microsoft-surface-pro-9',
    name: 'Microsoft Surface Pro 9',
    brand: 'Microsoft',
    category: 'tablet',
    width: 912,
    height: 1368,
    dpr: 2.0,
    frameType: 'tablet',
    year: '2022',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Tablet PC 2.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // ==================== DESKTOPS, LAPTOPS & KIOSKS ====================
  {
    id: 'macbook-neo-2026',
    name: 'Apple Macbook Neo 2026',
    brand: 'Apple',
    category: 'desktop',
    width: 1204,
    height: 753,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2026',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 16_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
  },
  {
    id: 'macbook-pro-16',
    name: 'Apple MacBook Pro 16"',
    brand: 'Apple',
    category: 'desktop',
    width: 1728,
    height: 1117,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  {
    id: 'desktop-ultra-2xl',
    name: 'Apple MacBook Pro 14" (Ultra 2XL)',
    brand: 'Apple',
    category: 'desktop',
    width: 1536,
    height: 960,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2024',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  },
  {
    id: 'macbook-pro-14',
    name: 'Apple MacBook Pro 14"',
    brand: 'Apple',
    category: 'desktop',
    width: 1512,
    height: 982,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  {
    id: 'macbook-air-13',
    name: 'Apple MacBook Air 13"',
    brand: 'Apple',
    category: 'desktop',
    width: 1280,
    height: 832,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2022',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
  },
  {
    id: 'imac-24',
    name: 'Apple iMac 24"',
    brand: 'Apple',
    category: 'desktop',
    width: 2048,
    height: 1152,
    dpr: 2.0,
    frameType: 'macbook',
    year: '2021',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
  },
  {
    id: 'desktop-4k',
    name: '4K UHD Desktop Monitor (3840×2160)',
    brand: 'Generic',
    category: 'desktop',
    width: 3840,
    height: 2160,
    dpr: 1.0,
    frameType: 'frameless',
    year: 'Standard',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  {
    id: 'desktop-2k',
    name: 'QHD 2K Desktop Monitor (2560×1440)',
    brand: 'Generic',
    category: 'desktop',
    width: 2560,
    height: 1440,
    dpr: 1.0,
    frameType: 'frameless',
    year: 'Standard',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  {
    id: 'desktop-1080p',
    name: 'Full HD 1080p Desktop (1920×1080)',
    brand: 'Generic',
    category: 'desktop',
    width: 1920,
    height: 1080,
    dpr: 1.0,
    frameType: 'frameless',
    year: 'Standard',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  {
    id: 'laptop-1366',
    name: 'Standard Laptop (1366×768)',
    brand: 'Generic',
    category: 'desktop',
    width: 1366,
    height: 768,
    dpr: 1.0,
    frameType: 'macbook',
    year: 'Standard',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  {
    id: 'interactive-kiosk',
    name: 'Interactive Kiosk / Totem (1080×1920)',
    brand: 'Generic',
    category: 'desktop',
    width: 1080,
    height: 1920,
    dpr: 1.0,
    frameType: 'frameless',
    year: 'Standard',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // ==================== SMARTWATCHES ====================
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (49mm)',
    brand: 'Apple',
    category: 'watch',
    width: 410,
    height: 502,
    dpr: 2.0,
    frameType: 'watch',
    year: '2023',
    userAgent: 'Mozilla/5.0 (AppleWatch; CPU OS 10_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21R356'
  },
  {
    id: 'apple-watch-s9',
    name: 'Apple Watch Series 9 (45mm)',
    brand: 'Apple',
    category: 'watch',
    width: 396,
    height: 484,
    dpr: 2.0,
    frameType: 'watch',
    year: '2023',
    userAgent: 'Mozilla/5.0 (AppleWatch; CPU OS 10_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/21R356'
  },
  {
    id: 'pixel-watch-2',
    name: 'Google Pixel Watch 2',
    brand: 'Google',
    category: 'watch',
    width: 384,
    height: 384,
    dpr: 2.0,
    frameType: 'watch',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel Watch 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36'
  },
  {
    id: 'galaxy-watch-6',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    category: 'watch',
    width: 396,
    height: 396,
    dpr: 2.0,
    frameType: 'watch',
    year: '2023',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-R940) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36'
  }
];

class DevicesManager {
  constructor() {
    this.devices = [...DEFAULT_DEVICES];
    this.customDevices = [];
    this.loadCustomDevices();
  }

  /**
   * Load custom devices from chrome.storage or localStorage
   */
  async loadCustomDevices() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['customDevices'], (res) => {
        if (res.customDevices && Array.isArray(res.customDevices)) {
          this.customDevices = res.customDevices;
          this.rebuildDevicesList();
        }
      });
    } else {
      const stored = localStorage.getItem('customDevices');
      if (stored) {
        try {
          this.customDevices = JSON.parse(stored);
          this.rebuildDevicesList();
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  rebuildDevicesList() {
    this.devices = [...this.customDevices, ...DEFAULT_DEVICES];
  }

  getAllDevices() {
    return this.devices;
  }

  getDeviceById(id) {
    return this.devices.find(d => d.id === id) || this.devices[0];
  }

  /**
   * Find best matching device profile for a given viewport width.
   * Dynamically adapts device name, category, chassis frame, aspect ratio, and DPR.
   */
  getAdaptedProfileForWidth(width) {
    let baseDevice = null;
    let category = 'mobile';
    let frameType = 'iphone-island';
    let height = 874;
    let name = '';
    let dpr = 2.0;

    if (width <= 385) {
      baseDevice = this.getDeviceById('iphone-se-3') || this.getDeviceById('iphone-13-mini') || this.devices.find(d => d.width === 375);
      category = 'mobile';
      frameType = 'iphone-notch';
      height = 667;
      name = 'Apple iPhone SE (Mobile S)';
      dpr = 2.0;
    } else if (width < 420) {
      baseDevice = this.getDeviceById('iphone-16-pro') || this.devices.find(d => d.width === 402);
      category = 'mobile';
      frameType = 'iphone-island';
      height = 874;
      name = 'Apple iPhone 16 Pro';
      dpr = 3.0;
    } else if (width < 550) {
      baseDevice = this.getDeviceById('iphone-16-plus') || this.devices.find(d => d.width === 430);
      category = 'mobile';
      frameType = 'iphone-island';
      height = 932;
      name = 'Apple iPhone 16 Plus (Mobile L)';
      dpr = 3.0;
    } else if (width < 700) {
      baseDevice = this.getDeviceById('foldable-tablet-640') || this.getDeviceById('iphone-duo-folded');
      category = 'tablet';
      frameType = 'tablet';
      height = 720;
      name = 'Foldable / Compact Tablet (640 SM)';
      dpr = 2.0;
    } else if (width < 800) {
      baseDevice = this.getDeviceById('ipad-10') || this.getDeviceById('ipad-mini');
      category = 'tablet';
      frameType = 'tablet';
      height = 1024;
      name = 'Apple iPad 10.9" (Tablet MD)';
      dpr = 2.0;
    } else if (width < 960) {
      baseDevice = this.getDeviceById('ipad-pro-11') || this.getDeviceById('ipad-air');
      category = 'tablet';
      frameType = 'tablet';
      height = 1194;
      name = 'Apple iPad Pro 11" (Tablet)';
      dpr = 2.0;
    } else if (width < 1180) {
      baseDevice = this.getDeviceById('ipad-pro-12-9');
      category = 'tablet';
      frameType = 'tablet';
      height = 768;
      name = 'Apple iPad Pro 12.9" (Laptop LG)';
      dpr = 2.0;
    } else if (width < 1400) {
      baseDevice = this.getDeviceById('macbook-air-13');
      category = 'desktop';
      frameType = 'macbook';
      height = 832;
      name = 'Apple MacBook Air 13" (Laptop XL)';
      dpr = 2.0;
    } else if (width < 1650) {
      baseDevice = this.getDeviceById('desktop-ultra-2xl') || this.getDeviceById('macbook-pro-14');
      category = 'desktop';
      frameType = 'macbook';
      height = 960;
      name = 'Apple MacBook Pro 14" (Ultra 2XL)';
      dpr = 2.0;
    } else if (width < 1850) {
      baseDevice = this.getDeviceById('macbook-pro-16');
      category = 'desktop';
      frameType = 'macbook';
      height = 1117;
      name = 'Apple MacBook Pro 16"';
      dpr = 2.0;
    } else if (width < 2200) {
      baseDevice = this.getDeviceById('desktop-1080p');
      category = 'desktop';
      frameType = 'frameless';
      height = 1080;
      name = 'Full HD 1080p Desktop (1920×1080)';
      dpr = 1.0;
    } else {
      baseDevice = this.getDeviceById('desktop-2k') || this.getDeviceById('desktop-4k');
      category = 'desktop';
      frameType = 'frameless';
      height = 1440;
      name = 'QHD 2K Desktop Monitor';
      dpr = 1.0;
    }

    if (!baseDevice) {
      baseDevice = this.devices[0];
    }

    return {
      ...baseDevice,
      name: name || baseDevice.name,
      category,
      frameType,
      width,
      height,
      dpr
    };
  }

  filterDevices({ category = 'all', brand = 'all', query = '' }) {
    return this.devices.filter(device => {
      // Category filter
      if (category !== 'all' && device.category !== category) return false;
      
      // Brand filter
      if (brand !== 'all') {
        if (brand === 'custom' && !device.isCustom) return false;
        if (brand !== 'custom' && device.brand.toLowerCase() !== brand.toLowerCase()) return false;
      }

      // Query filter
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = device.name.toLowerCase().includes(q);
        const matchesBrand = device.brand.toLowerCase().includes(q);
        const matchesRes = `${device.width}x${device.height}`.includes(q) || `${device.width} × ${device.height}`.includes(q);
        return matchesName || matchesBrand || matchesRes;
      }

      return true;
    });
  }

  async addCustomDevice(deviceData) {
    const id = 'custom-' + Date.now();
    const newDevice = {
      id,
      name: deviceData.name || 'Custom Device',
      brand: 'Custom',
      category: deviceData.category || 'mobile',
      width: parseInt(deviceData.width, 10) || 390,
      height: parseInt(deviceData.height, 10) || 844,
      dpr: parseFloat(deviceData.dpr) || 2.0,
      frameType: deviceData.frameType || 'frameless',
      year: new Date().getFullYear().toString(),
      userAgent: deviceData.userAgent || navigator.userAgent,
      isCustom: true
    };

    this.customDevices.push(newDevice);
    this.rebuildDevicesList();
    await this.saveCustomDevices();
    return newDevice;
  }

  async deleteCustomDevice(id) {
    this.customDevices = this.customDevices.filter(d => d.id !== id);
    this.rebuildDevicesList();
    await this.saveCustomDevices();
  }

  async saveCustomDevices() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ customDevices: this.customDevices });
    } else {
      localStorage.setItem('customDevices', JSON.stringify(this.customDevices));
    }
  }
}

// Export singleton instance
window.devicesManager = new DevicesManager();
