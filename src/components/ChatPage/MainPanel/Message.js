import React from 'react'
// import moment from 'moment';
import 'moment/locale/ko';

function Message({ message, user }) {

    // const timeFromNow = timestamp => moment(timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }
    const isMessageMine = (message, user) => {
       if(user) {
           return message.user.id === user.uid
       }
    }

    return (
        <div style={{ marginBottom: '3px', marginLeft: '5px',display:'flex', 
        justifyContent: isMessageMine(message, user) && "flex-end"}}>
            <img
                style={{ borderRadius: '10px' }}
                width={48}
                height={48}
                className="mr-3"
                src={message.user.image}
                alt={message.user.name}
            />
            <div style={{
                marginLeft: '5px',backgroundColor: isMessageMine(message, user) ? "#CDECFA" : "#FFF0F5",
                borderRadius:"15px",         
            }}>
                <h6 style={{ marginLeft: '5px',marginTop:"5px"}}>{message.user.name}{" "}
                    <span style={{ fontSize: '15px', color: 'gray' }}>
                        {(message.timestamp)}
                    </span>
                </h6>
                {isImage(message) ?
                    <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image} />
                    :
                    <p style={{ marginLeft: '5px',}}>
                        {message.content}
                    </p>
                }
            </div>
        </div>
    )
}

export default Message
