import mongoose from 'mongoose';

const jwtWhitelistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '15m' },
});

const JWTWhitelist = mongoose.model('jwt_whitelist', jwtWhitelistSchema);

export default JWTWhitelist;
