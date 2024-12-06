import mongoose from 'mongoose';

import { Collections } from '../constants.js';
import usersSchema from "../schemas/users.js";

const Users = mongoose.model(Collections.USERS, usersSchema);

export default Users;