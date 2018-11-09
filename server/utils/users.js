class Users {
    constructor() {
        this.users = []
    }

    addUser(id, name, room) {
        var user = {
            id,
            name,
            room
        }
        this.users.push(user);

        return user
    }

    getUsersList(room) {
        var userList = this.users.filter((user) => user.room === room);
        var namesArr = userList.map((user) => user.name);

        return namesArr;
    }

    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id)
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }


}

module.exports = { Users }