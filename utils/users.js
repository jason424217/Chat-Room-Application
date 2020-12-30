const users = [];

// join user to chat
function userJoin(id, username, password){
    var user = {id, username, password};
    const index = users.findIndex(user => user.username === username);
    if(index === -1){
        users.push(user);
        return user;
    }else{
        var userTmp = users[index];
        if(userTmp.password === user.password){
            users[index].id = id;
            return users[index];
        }else{
            return -1;
        }
    }
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin,
    getCurrentUser
};