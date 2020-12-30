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

socket.on('wrong_identity', msg => {
    console.log(msg);
    window.location.href = "/index.html";
    alert(msg); 
    throw msg;
})

socket.on('chatHistory', function(data){
    //will not ignore non-number index
    for(let i in data){
        outputMessage(data[i]);
    }
})

//message submit
chatForm.addEventListener('submit', (e)=>{
    //stop submit form alert
    e.preventDefault();

    //target is current element event happened and access the element and then id msg and then its vlaue
    const msg = e.target.elements.msg.value;
    
    //emit the message to server for server to process 
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    //focus on the empty input
    e.target.elements.msg.focus();
})

//message processed from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

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