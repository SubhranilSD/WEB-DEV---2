const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  location: { type: String, default: '' },
  mood: {
    type: String,
    enum: ['joyful', 'nostalgic', 'proud', 'sad', 'excited', 'peaceful', 'grateful', 'adventurous'],
    default: 'joyful'
  },
  media: [{
    url: { type: String },
    publicId: { type: String },
    type: { type: String, enum: ['image', 'video'], default: 'image' }
  }],
  tags: [{ type: String }],
  people: [{ type: String }],
  audioUrl: { type: String },
  unlockDate: { type: Date },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  color: { type: String, default: '#6366f1' },
  sortIndex: { type: Number, default: 0 },
  nodePosition: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  isPrivate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

eventSchema.index({ user: 1, date: -1 });
eventSchema.index({ user: 1, sortIndex: 1 });

module.exports = mongoose.model('Event', eventSchema);
