import { Schema, model, mongoose } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true },
  blockchainAddress: { type: String, required: true },
  faceAuth: { type: Boolean, default: false },
});

const User = mongoose.models.User || model('User', userSchema);

export default User;
