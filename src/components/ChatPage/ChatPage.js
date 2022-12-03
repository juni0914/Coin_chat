import React from 'react'
import SidePanel from './SidePanel/SidePanel'
import MainPanel from './MainPanel/MainPanel'
import { useSelector } from 'react-redux';
import Secondpage from './MainPanel/Secondpage';

function ChatPage() {
  const currentUser = useSelector(state => state.user.currentUser)
  const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom)

  return (
            <div style={{ display: 'flex' }}>
              <div style={{ width: '120vw' }}>
                  <SidePanel
                     key={currentUser && currentUser.uid}
                  />
              </div>
              <div style={{ width: '250vw' }}>
                <MainPanel
                    key={currentChatRoom && currentChatRoom.id}
                />
              </div>
              <div style={{ width: '250vw' }}>
                <Secondpage
                />
              </div>
            </div>
  )
}

export default ChatPage;