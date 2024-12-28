const e = require('express');
const JWT = require('jsonwebtoken');

const secret = "$uperman123@";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        profileImageURL: user.profileImageURL
    };
    const token = JWT.sign(payload,secret);
    return token;
}

function verifyToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    verifyToken
};