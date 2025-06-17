const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  role: { type: String, enum: ['guest', 'host'], default: 'guest' }
}, { timestamps: true });

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

userSchema.virtual('id').get(function() { return this._id.toHexString(); });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
