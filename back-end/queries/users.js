const db = require("../db/dbConfig");

const getAllUsers = async () => {
    try {
        const allUsers = await db.any("SELECT * FROM users");
        console.log(allUsers)
        return allUsers;
    } catch (error) {
        console.log(error)
    }
};

const getUser = async (id) => {
    try {
        const user = await db.one("SELECT * FROM users WHERE id = $1", id);
        return user;
    } catch (error) {
        console.log(error);
    }
};

const createUser = async (newUser) => {
    const { id, firstName, lastName, phoneNumber, dateOfBirth, address, email, image } = newUser;
    console.log(newUser);
    try {
        const createdUser = await db.one(
            `INSERT INTO users (id, first_name, last_name, phone_number, date_of_birth, address, email, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [id, firstName, lastName, phoneNumber, dateOfBirth, address, email, image]
        );
        return createdUser;
    } catch (error) {
        console.log(error);
    }
};

const updateUser = async (id, user) => {
    try {
        const { first_name, last_name, phone_number, date_of_birth, address, email, password, image } = user;
        const query = "UPDATE users SET first_name = $1, last_name = $2, phone_number = $3, date_of_birth = $4, address = $5, email = $6, password = $7, image = $8 WHERE id = $9 RETURNING *";
        const updatedUser = await db.one(query, [first_name, last_name, phone_number, date_of_birth, address, email, password, image, id]);
        return updatedUser;
    } catch (error) {
        return error;
    }
};

const deleteUser = async (id) => {
    try {
        const query = "DELETE FROM users WHERE id = $1 RETURNING *";
        const deletedUser = await db.one(query, id);
        return deletedUser;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}