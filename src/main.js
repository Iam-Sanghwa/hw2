document.addEventListener('DOMContentLoaded', function() {
  const loaderWrapper = document.querySelector('.loader-container');
  setTimeout(() => {
    loaderWrapper.style.display = 'none';
  }, 300); // 0.3초 후에 숨김
  loadProfiles()
})