document.querySelector('.search-btn').addEventListener('click', () => {
  const searchTerm = document.querySelector('.search-bar').value.toLowerCase();
  const profileNames = document.querySelectorAll('.profile .name');

  profileNames.forEach(name => {
    const profile = name.closest('.profile');
    const profileName = name.textContent.toLowerCase();

    if (profileName.includes(searchTerm)) {
      profile.style.display = 'block';
    } else {
      profile.style.display = 'none';
    }
  });
});

//ADD(C)
const addFunctionTrigger = document.querySelector('section.add-profile .btn.add-function')

addFunctionTrigger.addEventListener('click', function(){
    const image = document.querySelector('.add-profile .photo-upload').files[0]
    const name = document.querySelector('.add-profile .name').value || 'default name'
    const phone = document.querySelector('.add-profile .phone').value || 'default H.P'
    const email = document.querySelector('.add-profile .email').value || 'default e-mail'

    let reader = new FileReader()
    reader.onload = function(event){
        const imageData = event.target.result;
        const profileData = {
            image: imageData,
            name: name,
            phone: phone,
            email: email
        };

        let profiles = JSON.parse(localStorage.getItem('profiles')) || []
        profiles.push(profileData)
        localStorage.setItem('profiles', JSON.stringify(profiles))
        
        addPageLayout.style.display='none'
        addoverLay.style.display='none'
        loadProfiles()
        
        document.querySelector('.add-profile .photo-upload').value = "";
        document.querySelector('.add-profile .name').value = ''
        document.querySelector('.add-profile .phone').value = ''
        document.querySelector('.add-profile .email').value = ''
        
    };

    if(image){
        reader.readAsDataURL(image);
    } else {
        const defaultImage = '../img/default.png';
        fetch(defaultImage)
            .then(response => response.blob())
            .then(blob => {
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('기본 이미지를 불러오는 도중 오류가 발생했습니다:', error);
            });
    }
});

//Read(R)
function loadProfiles(){
  const mainContent = document.querySelector('main .profile-list .profile-container')
  mainContent.innerHTML = ''

  let profiles = JSON.parse(localStorage.getItem('profiles')) || []

  profiles.forEach(function(profile, index){
    const profileEl = document.createElement('div')
    profileEl.classList.add('profile')
    profileEl.innerHTML = /* html */ `
      <img src="${profile.image}" alt="Profile Image">
      <div class="name">${profile.name}</div>
      <div class="phone">${profile.phone}</div>
      <div class="email">${profile.email}</div>
      <div class="btn-box">
        <div class="btn detail-btn">detail</div>
        <div class="btn delete-btn">click to delete</div>
      </div>

    `
    mainContent.append(profileEl)
  })
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn') && event.target.textContent === 'detail') {
    const clickedButton = event.target
    const targetProfile = clickedButton.closest('.profile')

    if(targetProfile){
      const detailedImg = targetProfile.querySelector('img').src
      const detailedName = targetProfile.querySelector('.name').textContent
      const detailedPhone = targetProfile.querySelector('.phone').textContent
      const detailedEmail = targetProfile.querySelector('.email').textContent

      // 수정할 프로필의 인덱스 저장
      const profiles = JSON.parse(localStorage.getItem('profiles'));
      const index = Array.from(targetProfile.parentNode.children).indexOf(targetProfile);
      localStorage.setItem('editedProfileIndex', index.toString());

      showProfileDetail(detailedImg, detailedName, detailedPhone, detailedEmail)
    }
  }
})

function showProfileDetail(image, name, phone, email) {
  const detailOverlay = document.querySelector('.detail-overlay')
  const detailContent = document.querySelector('.profile-detail-container')
  
  detailContent.innerHTML = '';
  detailContent.innerHTML = /* html */ `
    <div class="btn detail-close">x</div>
    <div class="btn edit-character">Edit</div>
    <div class="profile-detail-content">
      <div class="detail-photo"><img src="${image}" alt="Profile Image"></div>
      <div class="detail-info">
        <div class="detail-name"><span>${name}</span></div>
        <div class="detail-phone"><span>${phone}</span></div>
        <div class="detail-email"><span>${email}</span></div>
      </div>
    </div>
  `
  const closeBtn = detailContent.querySelector('.detail-close')
  closeBtn.addEventListener('click', () => {
    detailContent.innerHTML=''
    detailOverlay.style.display = 'none'
  });
  detailOverlay.style.display = 'block'
}

// chat

// Event listener for "Edit" button
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-character')) {
    const editButton = event.target;
    const targetProfile = editButton.closest('.profile-detail-container');

    if (targetProfile) {
      const detailImg = targetProfile.querySelector('.detail-photo img').src;
      const detailName = targetProfile.querySelector('.detail-name span').textContent;
      const detailPhone = targetProfile.querySelector('.detail-phone span').textContent;
      const detailEmail = targetProfile.querySelector('.detail-email span').textContent;

      // Show edit form with current data
      showEditProfile(detailImg, detailName, detailPhone, detailEmail);
    }
  }
});

function showEditProfile(image, name, phone, email) {
  // 이미지 업로드 요소 찾기
  const editPhotoUpload = document.querySelector('.edit-profile-container .edit-profile .edit-photo .photo-upload');

  // 이미지 변경 시 로컬 스토리지에 반영
  editPhotoUpload.addEventListener('change', function(event) {
    console.log("File selected"); // 이 부분이 작동하는지 확인
    const selectedImage = event.target.files[0];
    const preview = document.querySelector('.edit-profile-container .photo-view img');

    if (selectedImage) {
      console.log("selected")
      const reader = new FileReader();
      reader.onload = function(event) {
        preview.src = event.target.result;
        // 새로운 이미지 데이터를 로컬 스토리지에 저장
        const editedProfileIndex = parseInt(localStorage.getItem('editedProfileIndex'));
        let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        profiles[editedProfileIndex].image = event.target.result; // 새로운 이미지 데이터로 업데이트
        localStorage.setItem('profiles', JSON.stringify(profiles));
      };

      reader.readAsDataURL(selectedImage);
    }
  });

  // 그 외의 코드는 그대로 유지
  const editProfileOverlay = document.querySelector('.add-edit-overlay');
  const editProfileContainer = document.querySelector('.edit-profile-container');

  // Populate edit form with current data
  editProfileContainer.innerHTML = /*html*/ `
    <div class="edit-profile">
      <div class="btn exit">x</div>
      <div class="edit-photo">
        <div class="photo-view"><img src="${image}" alt="Profile Image"></div>
        <label for="edit-photo-upload" class="btn">Choose Photo</label>
        <input type="file" id="edit-photo-upload" class="photo-upload" accept="image/*" style="display: none;">
      </div>
      <div class="input-section">
        <input type="text" value="${name}" class="name"><br>
      </div>
      <div class="input-section">
        <input type="text" value="${phone}" class="phone"><br>
      </div>
      <div class="input-section">
        <input type="text" value="${email}" class="email"><br>
      </div>
      <div class="btn edit-function">Save</div>
    </div>
  `
  
  // Show edit profile container and overlay
  editProfileContainer.style.display = 'block';
  editProfileOverlay.style.display = 'block';

  // Add event listener for save button
  const saveButton = editProfileContainer.querySelector('.edit-function');
  saveButton.addEventListener('click', () => {
    // Get edited data
    const editedName = editProfileContainer.querySelector('.name').value;
    const editedPhone = editProfileContainer.querySelector('.phone').value;
    const editedEmail = editProfileContainer.querySelector('.email').value;

    // Get edited profile index
    const editedProfileIndex = parseInt(localStorage.getItem('editedProfileIndex'));

    // Update profile data in localStorage
    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    profiles[editedProfileIndex] = {
      image: editProfileContainer.querySelector('.photo-view img').src, // 수정된 이미지 데이터 사용
      name: editedName,
      phone: editedPhone,
      email: editedEmail
    };
    localStorage.setItem('profiles', JSON.stringify(profiles));

    // Close edit profile form
    editProfileContainer.style.display = 'none';
    editProfileOverlay.style.display = 'none';

    // Reload profiles
    loadProfiles();
  });

  // Add event listener for exit button
  const exitButton = editProfileContainer.querySelector('.exit');
  exitButton.addEventListener('click', () => {
    editProfileContainer.style.display = 'none';
    editProfileOverlay.style.display = 'none';
  });
}

//chat

// DELETE (D)
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn') && event.target.textContent === 'click to delete') {
    const clickedButton = event.target;
    const targetProfile = clickedButton.closest('.profile');

    if(targetProfile){
      const profiles = JSON.parse(localStorage.getItem('profiles'));
      const index = Array.from(targetProfile.parentNode.children).indexOf(targetProfile);
      targetProfile.remove();
      if (index !== -1){
        profiles.splice(index, 1);
        localStorage.setItem('profiles', JSON.stringify(profiles)); // 수정된 프로필 목록 저장
      }
    }
  }
});
