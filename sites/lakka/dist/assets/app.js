const dialog = document.querySelector('dialog');
const booking = JSON.parse(document.getElementById('booking-config').textContent);
document.querySelectorAll('[data-book]').forEach(button => {
  button.addEventListener('click', () => {
    if (booking.url && /^https:\/\//.test(booking.url)) {
      window.location.assign(booking.url);
    } else {
      dialog.showModal();
    }
  });
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
