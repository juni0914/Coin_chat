import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import  Container  from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form  from 'react-bootstrap/Form';
import Image  from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { TbCrown} from 'react-icons/tb';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { getDatabase, ref, onValue, remove, child, update } from "firebase/database";


function MessageHeader({handleSearchChange}) {

  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
  const isPrivateChatRoom = useSelector(state=>state.chatRoom.isPrivateChatRoom)
  const [isFavorited, setIsFavorited] = useState(false);
  const usersRef = ref(getDatabase(), "users");
  const user = useSelector(state => state.user.currentUser);
  const userPosts = useSelector(state => state.chatRoom.userPosts)

  useEffect(() => {
    if (chatRoom && user) {
        addFavoriteListener(chatRoom.id, user.uid)
    }
}, [])

const addFavoriteListener = (chatRoomId, userId) => {

    onValue(child(usersRef, `${userId}/favorited`), data => {
        if (data.val() !== null) {
            const chatRoomIds = Object.keys(data.val());
            const isAlreadyFavorited = chatRoomIds.includes(chatRoomId)
            setIsFavorited(isAlreadyFavorited)
            // console.log('data.val()',data.val())
            // console.log('chatRoomIds',chatRoomIds )
        }
    })

}

  const handleFavorite = () => {
    if (isFavorited) {
      setIsFavorited(prev => !prev)
      remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`))
  } else {
      setIsFavorited(prev => !prev)
      update(child(usersRef, `${user.uid}/favorited`), {
          [chatRoom.id]: {
              name: chatRoom.name,
              description: chatRoom.description,
              createdBy: {
                  name: chatRoom.createdBy.name,
                  image: chatRoom.createdBy.image
              }
          }
      })
  }
  }

  const renderUserPosts = (userPosts) =>
  Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
          <div key={i} style={{ display: 'flex'}}>
              <img
                  style={{ borderRadius: 25, marginLeft: '10px', marginTop: '2px' }}
                  width={48}
                  height={48}
                  className="mr-3"
                  src={val.image }
                  alt={val.name}
              />
              <div>
                  <h6 style={{marginLeft: '10px'}}>{key}</h6>
                  <p style={{marginLeft: '10px'}}>
                      {val.count} 개의 보낸 메세지
                  </p>
              </div>
          </div>
      ))
      
  return (
    <div style={{
        width: '100%',
        height: '230px',
        border: '.2rem solid #ececec',
        borderRadius: '20px',
        padding: '1rem',
        marginBottom: '1rem'

    }}>
    <Container>
      <Row>
          {/* <Col> */}
            <h2>
              { isPrivateChatRoom  ?
              <FaLock style={{marginBottom: '10px'}}/>
              :
              <FaLockOpen style={{marginBottom: '10px'}}/>
              }ㅤ
              {chatRoom && chatRoom.name} 

              {!isPrivateChatRoom &&
                                  <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                                      {isFavorited ?
                                          <MdFavorite style={{ marginBottom: '9px' }} />
                                          :
                                          <MdFavoriteBorder style={{ marginBottom: '9px' }} />
                                      }
                                  </span>
                              }
            </h2>
          {/* </Col> */}


          {/* <Col> */}
            <InputGroup className="mb-0" style={{ width:'50%',marginTop:'5px'}}>
              <InputGroup.Text id="basic-addon1"><AiOutlineSearch/></InputGroup.Text>
              <Form.Control
                onChange={handleSearchChange}
                placeholder="메세지 검색하기"
                aria-label="검색"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          {/* </Col> */}
      </Row>
        
          <div style={{display: 'flex',  justifyContent: 'flex-end'}}>

              <p style={{marginRight:'20px'}}>
              <TbCrown/>  ㅤ
              <Image src={chatRoom && chatRoom.createdBy.image}
                                  roundedCircle style={{ width: '40px', height: '40px', marginRight:"5px" }}
                /> {" "} {chatRoom && chatRoom.createdBy.name}
              </p>
              
          </div>
        
        <Row>
        <Col>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>방 설명</Accordion.Header>
              <Accordion.Collapse eventKey="0">
                  <Card.Body style={{marginTop: '8px', marginBottom: '5px',marginLeft: '5px'
                ,position: 'relative',backgroundColor: 'white'}}>
                    {chatRoom && chatRoom.description}
                    
                  </Card.Body>
              </Accordion.Collapse>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header >보낸 메세지 수</Accordion.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body style={{ marginTop: '12px',position: 'relative',backgroundColor: 'white'}}>
                      {userPosts && renderUserPosts(userPosts)}
                    </Card.Body>
                </Accordion.Collapse>
              </Accordion.Item>
            </Accordion>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default MessageHeader;