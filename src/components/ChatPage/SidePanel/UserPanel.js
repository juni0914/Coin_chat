import React, { useRef } from 'react'
import { ImCoinDollar } from 'react-icons/im';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';
import { getDatabase, ref, child, update } from "firebase/database";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref as strRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function UserPanel() {
  const user = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
  }

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    const auth = getAuth();
    const user = auth.currentUser;
    const metadata = { contentType: file.type };
    const storage = getStorage();

    try {
      //스토리지에 파일 저장하기 
      let uploadTask = uploadBytesResumable(strRef(storage, `user_image/${user.uid}`), file, metadata)


      uploadTask.on('state_changed',
          (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                  case 'paused':
                      console.log('Upload is paused');
                      break;
                  case 'running':
                      console.log('Upload is running');
                      break;
              }
          },
          (error) => {
              switch (error.code) {
                  case 'storage/unauthorized':
                      break;
                  case 'storage/canceled':
                      break;

                  // ...

                  case 'storage/unknown':
                      break;
              }
          },
          () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  // 프로필 이미지 수정
                  updateProfile(user, {
                      photoURL: downloadURL
                  })

                  dispatch(setPhotoURL(downloadURL))

                  //데이터베이스 유저 이미지 수정
                  update(ref(getDatabase(), `users/${user.uid}`), { image: downloadURL })
              });
          }
      );
      // console.log('uploadTaskSnapshot', uploadTaskSnapshot)
  } catch (error) {
      alert(error)
  }
}

  return (
    <div>
      <h3 style={{color : 'white'}}>
        <ImCoinDollar style={{marginBottom: "7px", marginRight: "5px"}}/>{" "}Coin Chat
      </h3>    
      <div style={{display : 'flex', marginBottom : '1rem'}}>
        <Image src={user && user.photoURL}
          style={{width : '30p', height : '50px', maginTop : '3px'}} 
          roundedCircle/>

        <Dropdown>
          <Dropdown.Toggle
                        style={{ background: 'transparent', border: '0px' , maginTop : '3px'}}
                        id="dropdown-basic">ㅤ
                        {user && user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu >
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </div>

      <input
            onChange={handleUploadImage}
            accept="image/jpeg, image/png"
            style={{ display: 'none' }}
            ref={inputOpenImageRef}
            type="file"
            />

    </div>
  )
}

export default UserPanel;
