const users = [];

// join user to chat
function userJoin(id, username, password){
    const user = {id, username, password};
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// user leave hcat
/*function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        //delete user and return the user
        return users.splice(index, 1)[0];
    }
}*/

module.exports = {
    userJoin,
    getCurrentUser
};