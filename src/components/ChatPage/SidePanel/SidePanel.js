import React from 'react'
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';

function SidePanel() {
  return (
    <div
    style={{
        backgroundColor: "#A390EE",
        padding: '2rem',
        minHeight: '97%',
        color: 'white',
        minWidth: '100px',
        borderRadius: '20px',
        marginLeft: '10px',
        marginTop: '30px'
    }}>
        <UserPanel />

        <Favorited />

        <ChatRooms />

        <DirectMessages />
    </div>
  )
}

export default SidePanel;