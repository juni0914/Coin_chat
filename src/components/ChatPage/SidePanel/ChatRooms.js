import React, { Component } from 'react'
import { FaPlus } from 'react-icons/fa';
import { GrChatOption } from 'react-icons/gr';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import { RiChatSmile3Line } from 'react-icons/ri';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { connect } from 'react-redux';
import { update } from 'firebase/database';
import { getDatabase, ref, onChildAdded, onValue, push, child, off } from "firebase/database";
import { setCurrentChatRoom, setPrivateChatRoom  } from '../../../redux/actions/chatRoom_action';

export class ChatRooms extends Component {

  state = {
      show: false,
      name: "",
      description: "",
      chatRoomsRef: ref(getDatabase(), "chatRooms"),
      messagesRef: ref(getDatabase(), "messages"),
      chatRooms: [],
      firstLoad: true,
      activeChatRoomId: "",
      notifications: []
  }

  componentDidMount() {
      this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
      off(this.state.chatRoomsRef);
  }

  setFirstChatRoom = () => {

      const firstChatRoom = this.state.chatRooms[0]
      if (this.state.firstLoad && this.state.chatRooms.length > 0) {
          this.props.dispatch(setCurrentChatRoom(firstChatRoom))
          this.setState({ activeChatRoomId: firstChatRoom.id })
      }
      this.setState({ firstLoad: false })

  }


  AddChatRoomsListeners = () => {
      let chatRoomsArray = [];

      onChildAdded(this.state.chatRoomsRef, DataSnapshot => {
          chatRoomsArray.push(DataSnapshot.val());
          this.setState({ chatRooms: chatRoomsArray },
              () => this.setFirstChatRoom());
          this.addNotificationListener(DataSnapshot.key);
      })

  }

  addNotificationListener = (chatRoomId) => {
      let { messagesRef } = this.state;
      onValue(child(messagesRef, chatRoomId), DataSnapshot => {
          if (this.props.chatRoom) {
              this.handleNotification(
                  chatRoomId,
                  this.props.chatRoom.id,
                  this.state.notifications,
                  DataSnapshot
              )
          }
      })

  }

  handleNotification = (chatRoomId, currentChatRoomId, notifications, DataSnapshot) => {

      let lastTotal = 0;

      // ?????? notifications state ?????? ?????? ????????? ???????????? ???????????? ????????? ?????? ???????????? ???????????? 
      let index = notifications.findIndex(notification =>
          notification.id === chatRoomId)

      //notifications state ?????? ?????? ???????????? ?????? ????????? ?????? ??? 
      if (index === -1) {
          notifications.push({
              id: chatRoomId,
              total: DataSnapshot.size,
              lastKnownTotal: DataSnapshot.size,
              count: 0
          })
      }
      // ?????? ?????? ???????????? ?????? ????????? ?????? ??? 
      else {
          //???????????? ?????? ????????? ??? ?????? ???????????? ?????? ?????? ??? 
          if (chatRoomId !== currentChatRoomId) {
              //???????????? ????????? ????????? ??? ????????? ?????? 
              lastTotal = notifications[index].lastKnownTotal

              //count (???????????? ????????? ??????)??? ????????? 
              //?????? ??? ????????? ?????? - ????????? ????????? ??? ????????? ?????? > 0
              //?????? ??? ????????? ????????? 10????????? ????????? ????????? ???????????? 8??? ????????? 2?????? ???????????? ???????????????.
              if (DataSnapshot.size - lastTotal > 0) {
                  notifications[index].count = DataSnapshot.size - lastTotal;
              }
          }
          //total property??? ?????? ?????? ????????? ????????? ????????????
          notifications[index].total = DataSnapshot.size;
      }
      //????????? ??? ?????? ????????? ?????? ?????? ????????? notifications state???  ???????????? 
      this.setState({ notifications })

  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = (e) => {
      e.preventDefault();
      const { name, description } = this.state;

      if (this.isFormValid(name, description)) {
          this.addChatRoom();
      }

  }

  addChatRoom = async () => {

      const key = push(this.state.chatRoomsRef).key;
      const { name, description } = this.state;
      const { user } = this.props
      const newChatRoom = {
          id: key,
          name: name,
          description: description,
          createdBy: {
              name: user.displayName,
              image: user.photoURL
          }
      }

      try {
          await update(child(this.state.chatRoomsRef, key), newChatRoom)
          this.setState({
              name: "",
              description: "",
              show: false
          })
      } catch (error) {
          alert(error)
      }
  }


  isFormValid = (name, description) =>
      name && description;


  changeChatRoom = (room) => {
      this.props.dispatch(setCurrentChatRoom(room));
      this.props.dispatch(setPrivateChatRoom(false));
      this.setState({ activeChatRoomId: room.id })
      this.clearNotifications();
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.props.chatRoom.id
    )
    if(index !== -1){
      let updateNotifications = [...this.state.notifications];
      updateNotifications[index].lastKnownTotal = this.state.notifications[index].total;
      updateNotifications[index].count = 0;
      this.setState({notifications: updateNotifications});
    }
  }

  getNotificationCount = (room) => {
      //?????? ???????????? count?????? ????????? ????????????.
      let count = 0;

      this.state.notifications.forEach(notification => {
          if (notification.id === room.id) {
              count = notification.count;
          }
      })
      if (count > 0) return count;
  }

      renderChatRooms = (chatRooms) =>
        chatRooms.length > 0 &&
        chatRooms.map(room => (
            <li
                key={room.id}
                style={{
                    backgroundColor: room.id === this.state.activeChatRoomId &&
                        "#ffffff45"
                }}
                onClick={() => this.changeChatRoom(room)} >
                    
                # {room.name}
                <Badge style={{ float: 'right', marginTop: '2px' }}bg="danger">
                    {this.getNotificationCount(room)}
                </Badge>
            </li>
        ))

  render() {
    return (
      <div>
        <div style={{
            position: 'relative', width: '100%',
            display: 'flex', alignItems: 'center'
        }}>
            <RiChatSmile3Line style={{ marginRight: '10px'}}/>
            CHAT ROOMS???{" "} ({this.state.chatRooms.length})

            <FaPlus 
              onClick={this.handleShow}
              style={{
                position: 'absolute',
                right: 0, cursor: 'pointer'
            }}/>
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {this.renderChatRooms(this.state.chatRooms)}
        </ul>
        

      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>?????? ??? ????????????</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Form onSubmit={this.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>??? ??????</Form.Label>
                  <Form.Control
                      onChange={(e) => this.setState({ name: e.target.value})}

                      placeholder=" ?????? ??? ????????? ?????????????????? !" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>??? ??????</Form.Label>
                  <Form.Control
                      onChange={(e) => this.setState({ description: e.target.value})}
                      type="text" placeholder=" ?????? ?????? ?????????????????? !" />
                </Form.Group>
              </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            ??????
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            ????????????
          </Button>
        </Modal.Footer>
      </Modal>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom
  }
}
export default connect(mapStateToProps)(ChatRooms)