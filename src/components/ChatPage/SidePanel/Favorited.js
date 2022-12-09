import React, { Component } from 'react'
import { FaRegHeart } from 'react-icons/fa';
import { connect } from 'react-redux';
import {
    setCurrentChatRoom,
    setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';

import { child, getDatabase, ref, onChildAdded, onChildRemoved, off, onChildChanged} from "firebase/database";

export class Favorited extends Component {

    state = {
        favoritedChatRooms: [],
        activeChatRoomId: '',
        userRef: ref(getDatabase(), 'users')
    }

    componentDidMount() {
        if (this.props.user) {
            this.addListeners(this.props.user.uid)
        }
    }

    componentWillUnmount() {
        if (this.props.user) {
            this.removeListener(this.props.user.uid);
        }
    }

    removeListener = (userId) => {
        const { userRef } = this.state;
        off(child(userRef, `${userId}/favorited`));
    }

    addListeners = (userId) => {
        const { userRef } = this.state;

        onChildAdded(child(userRef, `${userId}/favorited`), DataSnapshot => {
            const favoritedChatRoom = { 
                id: DataSnapshot.key, 
                ...DataSnapshot.val()
            };
            this.setState({
                favoritedChatRooms: [
                    ...this.state.favoritedChatRooms, // 이 부분 확인하기. deep copy , 새 배열을 만들어서 넣어주고 그걸 부르기
                    favoritedChatRoom
                ]  // 디비 저장방식문제일수도 있음 확인하자
                
            });
        });

        onChildRemoved (child(userRef, `${userId}/favorited`), DataSnapshot => {
            const chatRoomToRemove = {
                 id: DataSnapshot.key,
                ...DataSnapshot.val(),
             };
            const filteredChatRooms = this.state.favoritedChatRooms.filter(
                (chatRoom) => {
                    return chatRoom.id !== chatRoomToRemove.id;
                }
            );
            this.setState({ favoritedChatRooms: filteredChatRooms })
        });
    };


    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.props.dispatch(setPrivateChatRoom(false));
        this.setState({ activeChatRoomId: room.id });

    }

    renderFavoritedChatRooms = (favoritedChatRooms) =>
        favoritedChatRooms.length > 0 &&
        favoritedChatRooms.map(chatRoom => (        //map 반복문에서 새롭게 저장할 state 만들어서 다시 해보자
            <li
                key={chatRoom.id}
                onClick={() => this.changeChatRoom(chatRoom)}
                style={{
                    backgroundColor: chatRoom.id === this.state.activeChatRoomId && "#ffffff45"
                }}
            >
                # {chatRoom.name} 


            </li>
        ))

    render() {
        const { favoritedChatRooms } = this.state;     
        return (         
            <div>           
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FaRegHeart style={{ marginRight: '10px' }} />
                    FAVORITEDㅤ({favoritedChatRooms.length})               
                </span>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {this.renderFavoritedChatRooms(favoritedChatRooms)}
                {/* {console.log(favoritedChatRooms)} */}
                </ul>

            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(Favorited);
