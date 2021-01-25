import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;
const CONNECTION_PORT = 'localhost:3001/';

function App() {
  // befoore logins
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');

  // after login
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit('join_room', room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room,
      content: {
        author: username,
        message,
      },
    };

    await socket.emit('send_message', messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage('');
  };

  return (
    <div className='App'>
      {!loggedIn ? (
        <div className='login'>
          <div className='inputs'>
            <input
              type='text'
              placeholder='name'
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type='text'
              placeholder='room'
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToRoom}>Enter chat</button>
        </div>
      ) : (
        <div className='chat-container'>
          <div className='messages'>
            {messageList.map((val, key) => (
              <div
                key={key}
                className='message-container'
                id={val.author === username ? 'you' : 'other'}
              >
                <div className='messageIndividual'>
                  {val.message}-{val.author}
                </div>
              </div>
            ))}
          </div>

          <div className='message-input'>
            <input
              type='text'
              placeholder='message'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendMessage}>send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
