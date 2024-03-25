const addPageLayout = document.querySelector('.add-profile')
const addpageOpen = document.querySelector('header .add-character')
const addpageClose = document.querySelector('.add-profile .btn.exit')
const addoverLay = document.querySelector('section.add-edit-overlay')

addpageOpen.addEventListener('click', function() {
  addPageLayout.style.display = 'block';
  addoverLay.style.display = 'block';
});

addpageClose.addEventListener('click', function() {
  addPageLayout.style.display = 'none';
  addoverLay.style.display = 'none';
});