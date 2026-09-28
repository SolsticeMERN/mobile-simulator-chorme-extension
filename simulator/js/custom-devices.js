/**
 * Mobile Responsive Simulator - Custom Device Creator & Manager
 */

class CustomDeviceUI {
  constructor() {
    this.modalEl = null;
    this.formEl = null;
  }

  init(modalEl, formEl) {
    this.modalEl = modalEl;
    this.formEl = formEl;

    if (this.formEl) {
      this.formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }
  }

  open() {
    if (this.modalEl) {
      this.modalEl.classList.add('open');
      const nameInput = this.formEl.querySelector('#custom-name');
      if (nameInput) nameInput.focus();
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.remove('open');
      if (this.formEl) this.formEl.reset();
    }
  }

  async handleFormSubmit() {
    const name = this.formEl.querySelector('#custom-name').value.trim();
    const width = parseInt(this.formEl.querySelector('#custom-width').value, 10);
    const height = parseInt(this.formEl.querySelector('#custom-height').value, 10);
    const dpr = parseFloat(this.formEl.querySelector('#custom-dpr').value) || 2.0;
    const category = this.formEl.querySelector('#custom-category').value;
    const frameType = this.formEl.querySelector('#custom-frame-type').value;
    const userAgent = this.formEl.querySelector('#custom-ua').value.trim();

    if (!name || isNaN(width) || isNaN(height)) {
      if (window.app) window.app.showToast('Please provide device name and valid dimensions.');
      return;
    }

    const newDevice = await window.devicesManager.addCustomDevice({
      name,
      width,
      height,
      dpr,
      category,
      frameType,
      userAgent: userAgent || navigator.userAgent
    });

    this.close();

    if (window.app) {
      window.app.showToast(`Custom device "${name}" created!`);
      window.app.selectDevice(newDevice.id);
    }
  }
}

window.customDeviceUI = new CustomDeviceUI();
