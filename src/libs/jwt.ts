import jwt from 'jsonwebtoken';

const sign = (payload: object, secret: string, expiresIn: string): string => jwt.sign(payload, secret, { expiresIn });

const verify = (token: string, secret: string): string | object => jwt.verify(token, secret);

export default {
    sign,
    verify,
};
