const Modal = {
  show({ title, body, footer, onConfirm, onCancel }) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay open" onclick="if(event.target===this)Modal.close()">
        <div class="modal">
          <div class="modal-header">
            <h3>${title || 'Modal'}</h3>
            <button class="modal-close" onclick="Modal.close()">✕</button>
          </div>
          <div class="modal-body">${body || ''}</div>
          <div class="modal-footer">
            ${footer || `
              <button class="btn btn-outline" onclick="Modal.close()">Cancelar</button>
              <button class="btn btn-primary" id="modal-confirm">Guardar</button>
            `}
          </div>
        </div>
      </div>
    `;
    if (onConfirm) document.getElementById('modal-confirm').onclick = onConfirm;
    if (onCancel) document.getElementById('modal-cancel')?.addEventListener('click', onCancel);
  },

  close() {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
  },
};

window.Modal = Modal;
