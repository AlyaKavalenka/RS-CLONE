/* eslint-disable no-unused-vars */
import { useContext, useState } from 'react';
import {
  onSnapshot, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Avatar from '../Avatar/Avatar';
import { AuthContext } from '../../context/AuthContext';
import { ActiveChatContext } from '../../context/ActiveChatContext';
import type { User, UserChat } from '../../types';
import './ChatPreview.scss';
import { convertTimestamp } from '../../hooks/timestampConverter';

interface ChatPreviewProps {
  data: UserChat,
  isActive: boolean,
  setActiveUserID: React.Dispatch<React.SetStateAction<string>>,
  isSearchMode: boolean,
  setSearchMode: React.Dispatch<React.SetStateAction<boolean>>,
  onContextMenu: (event: React.MouseEvent, id: string) => void
}

function ChatPreview({
  data, isActive, setActiveUserID, isSearchMode, setSearchMode, onContextMenu,
}: ChatPreviewProps) {
  const {
    uid, displayName, photoURL, isOnline,
  } = data.userInfo;

  const { activeChatID, setActiveChatID } = useContext(ActiveChatContext);
  const currentUser: User = useContext(AuthContext) as User;

  const resetMessagesCounter = async () => {
    if (activeChatID) {
      await updateDoc(doc(db, 'userChats', currentUser.uid), {
        [`${activeChatID}.unreadMessages`]: 0,
      });
    }
  };
  const [isOnlineStatus, setIsOnlineStatus] = useState(isOnline || false);

  const selectChat = () => {
    const combinedID = currentUser.uid > uid ? `${currentUser.uid}${uid}` : `${uid}${currentUser.uid}`;
    setActiveUserID(uid);
    resetMessagesCounter();
    setActiveChatID(combinedID);
    setSearchMode(false);
  };

  if (isSearchMode) {
    onSnapshot(doc(db, 'users', uid), (d) => {
      const userData = d.data();
      if (!userData) return;
      setIsOnlineStatus(userData.isOnline);
    });
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    onContextMenu(event, uid);
  };

  return (
    <button
      type="button"
      className={`chat-preview ${isActive ? 'active' : ''}`}
      onClick={selectChat}
      onContextMenu={handleContextMenu}
    >
      <div className="chat-preview-wrapper">
        <Avatar image={photoURL} />
        <div className="chat-preview-text">
          <div className="chat-preview__title">{displayName}</div>
          {isSearchMode
            ? <div className="chat-preview__online-status">{isOnlineStatus ? 'Online' : 'Offline'}</div>
            : <div className="chat-preview__last-message">{data?.lastMessage.text}</div>}
        </div>
      </div>
      {!isSearchMode && (
      <div className="chat-preview__info">
        <div className="chat-preview__messenge-time">{convertTimestamp(data?.lastMessage.date)}</div>
        {data?.unreadMessages && !isActive ? <div className="chat-preview__messenge-num">{data?.unreadMessages}</div> : null}
      </div>
      )}
    </button>
  );
}

export default ChatPreview;
