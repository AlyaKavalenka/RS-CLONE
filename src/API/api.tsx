/* eslint-disable no-console */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc, setDoc, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';

export const singUp = async (
  name: string,
  email: string,
  password: string,
  avatar: File | null,
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const storageRef = ref(storage, `${name}${Math.floor(100000 + Math.random() * 900000)}`);
    const uploadTask = uploadBytesResumable(storageRef, avatar as File);
    const mainGroupChatID = 'g_6j5jkb5JQJrT4xkArXtq';

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: name,
      email,
      photoURL: '',
      isOnline: true,
    });

    await setDoc(doc(db, 'userChats', user.uid), {});
    await setDoc(doc(db, 'userGroups', user.uid), {});

    await updateDoc(doc(db, 'userGroups', user.uid), {
      [`${mainGroupChatID}.groupInfo`]: {
        displayName: 'Launge',
        photoURL: '',
      },
      [`${mainGroupChatID}.lastMessage`]: {},
    });

    await updateDoc(doc(db, 'chats', mainGroupChatID), {
      members: arrayUnion({
        [user.uid]: true,
      }),
    });

    await updateProfile(user, {
      displayName: name,
    });

    if (avatar) {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          return progress;
        },
        (error) => {
          throw error;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(user, {
              photoURL: downloadURL,
            });
            await updateDoc(doc(db, 'users', user.uid), {
              photoURL: downloadURL,
            });
          });
        },
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const singIn = async (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const { user } = userCredential;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

export const logOut = async () => {
  signOut(auth).then(() => {
    console.log('Sign-out successful.');
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};

export const changeProfileName = async (newName: string) => {
  if (newName && auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: newName,
    });
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      displayName: newName,
    });
  }
};

export const changeProfilePhoto = async (
  name: string,
  photoList: FileList | null,
) => {
  if (photoList && auth.currentUser) {
    const avatar = photoList[0];
    const storageRef = ref(storage, `${name}${Math.floor(100000 + Math.random() * 900000)}`);
    const uploadTask = uploadBytesResumable(storageRef, avatar as File);
    if (avatar) {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          return progress;
        },
        (error) => {
          throw error;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            if (auth.currentUser) {
              await updateProfile(auth.currentUser, {
                photoURL: downloadURL,
              });
              await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                photoURL: downloadURL,
              });
            }
            return downloadURL;
          });
        },
      );
    }
    return getDownloadURL((await uploadTask).ref);
  }
  return null;
};
