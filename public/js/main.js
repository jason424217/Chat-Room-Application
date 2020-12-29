const chatForm = document.getElementById('chat-form');
//get the first element with class="example" from the document:
const chatMessages = document.querySelector('.chat-messages'); 
const userList = document.getElementById('users');

//get user nane and room from the URL window.location.search
const { username, password } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chat
socket.emit('joinRoom', {username, password});

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//message submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //target is current elemnt and access the element and then id msg and then its vlaue
    const msg = e.target.elements.msg.value;
    
    //emit the message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    //focus on the empty input
    e.target.elements.msg.focus();
})


//output message to DOM
function outputMessage(message){
    //each emssage has a div
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = '<p class="meta">'+
    message.username + '<span> '+
    message.time +'</span></p><p class="text">'+
    message.text +
    '</p>';
    document.querySelector('.chat-messages').appendChild(div);
}