import { ObjectId } from 'mongodb';

class User {
    constructor(username, email, password, role = 'student', age = null, guardianName = null) {
        this._id = new ObjectId();
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.age = age;
        this.guardianName = guardianName;
        this.createdAt = new Date();
        this.lastLogin = null;
    }

    static collectionName = 'Users';

    toJSON() {
        return {
            _id: this._id,
            username: this.username,
            email: this.email,
            role: this.role,
            age: this.age,
            guardianName: this.guardianName,
            createdAt: this.createdAt,
            lastLogin: this.lastLogin
        };
    }
}

export default User;