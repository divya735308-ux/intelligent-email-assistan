const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { isFallbackMode } = require('../config/db');
const { getProcessedSeedEmails } = require('../data/seedEmails');

const fallbackDataFile = path.join(__dirname, '../data/local_emails.json');

// Mongoose Schema Definition
const emailSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  recipientEmail: { type: String, default: 'user@example.com' },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isImportant: { type: Boolean, default: false },
  isSpam: { type: Boolean, default: false },
  spamCategory: { 
    type: String, 
    enum: ['SAFE', 'SPAM', 'SUSPICIOUS', 'PHISHING'], 
    default: 'SAFE' 
  },
  spamRisk: { 
    type: String, 
    enum: ['Low Risk', 'Medium Risk', 'High Risk'], 
    default: 'Low Risk' 
  },
  spamScore: { type: Number, default: 10 },
  spamReason: [{ type: String }],
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  folder: { type: String, default: 'inbox' },
  tags: [{ type: String }],
  aiAnalysis: {
    summary: { type: String, default: '' },
    mainTopic: { type: String, default: 'General' },
    keyPoints: [{ type: String }],
    actionItems: [{ type: String }],
    deadlines: [{ type: String }],
    sentiment: { type: String, default: 'Neutral' },
    analyzedAt: { type: Date }
  }
}, {
  timestamps: true
});

const MongooseEmailModel = mongoose.model('Email', emailSchema);

// --- Local In-Memory / File Persistent Store Adapter (Fallback if MongoDB service is not started) ---
let localStore = [];

function loadLocalStore() {
  try {
    if (fs.existsSync(fallbackDataFile)) {
      const data = fs.readFileSync(fallbackDataFile, 'utf8');
      localStore = JSON.parse(data);
    } else {
      localStore = getProcessedSeedEmails();
      saveLocalStore();
    }
  } catch (err) {
    localStore = getProcessedSeedEmails();
  }
}

function saveLocalStore() {
  try {
    const dir = path.dirname(fallbackDataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fallbackDataFile, JSON.stringify(localStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
}

// Initial load
loadLocalStore();

// Unified Model Interface supporting both MongoDB Mongoose and Local Embedded Store
const EmailRepository = {
  // Query all or filtered emails
  async find(filter = {}) {
    if (!isFallbackMode()) {
      try {
        const query = {};
        if (filter.folder && filter.folder !== 'all') query.folder = filter.folder;
        if (filter.isRead !== undefined) query.isRead = filter.isRead;
        if (filter.isImportant !== undefined) query.isImportant = filter.isImportant;
        if (filter.isSpam !== undefined) query.isSpam = filter.isSpam;
        if (filter.isArchived !== undefined) query.isArchived = filter.isArchived;
        if (filter.isDeleted !== undefined) query.isDeleted = filter.isDeleted;
        if (filter.spamCategory) query.spamCategory = filter.spamCategory;

        return await MongooseEmailModel.find(query).sort({ date: -1 });
      } catch (err) {
        console.warn('MongoDB query failed, falling back to local store:', err.message);
      }
    }

    // Local fallback query
    loadLocalStore();
    return localStore.filter(email => {
      if (filter.folder && filter.folder !== 'all' && email.folder !== filter.folder) return false;
      if (filter.isRead !== undefined && email.isRead !== filter.isRead) return false;
      if (filter.isImportant !== undefined && email.isImportant !== filter.isImportant) return false;
      if (filter.isSpam !== undefined && email.isSpam !== filter.isSpam) return false;
      if (filter.isArchived !== undefined && email.isArchived !== filter.isArchived) return false;
      if (filter.isDeleted !== undefined && email.isDeleted !== filter.isDeleted) return false;
      if (filter.spamCategory && email.spamCategory !== filter.spamCategory) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Find by ID
  async findById(id) {
    if (!isFallbackMode()) {
      try {
        const found = await MongooseEmailModel.findById(id);
        if (found) return found;
      } catch (err) {}
    }

    loadLocalStore();
    return localStore.find(e => (e._id || e.id) == id) || null;
  },

  // Create new email
  async create(emailData) {
    if (!isFallbackMode()) {
      try {
        const newEmail = new MongooseEmailModel(emailData);
        return await newEmail.save();
      } catch (err) {
        console.warn('MongoDB create failed, falling back to local store');
      }
    }

    loadLocalStore();
    const newId = emailData._id || `email_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const created = {
      _id: newId,
      id: newId,
      ...emailData,
      date: emailData.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    localStore.unshift(created);
    saveLocalStore();
    return created;
  },

  // Update email by ID
  async findByIdAndUpdate(id, updates, options = { new: true }) {
    if (!isFallbackMode()) {
      try {
        const updated = await MongooseEmailModel.findByIdAndUpdate(id, updates, options);
        if (updated) return updated;
      } catch (err) {}
    }

    loadLocalStore();
    const index = localStore.findIndex(e => (e._id || e.id) == id);
    if (index === -1) return null;

    localStore[index] = {
      ...localStore[index],
      ...updates,
      updatedAt: new Date()
    };
    saveLocalStore();
    return localStore[index];
  },

  // Delete email by ID
  async findByIdAndDelete(id) {
    if (!isFallbackMode()) {
      try {
        const deleted = await MongooseEmailModel.findByIdAndDelete(id);
        if (deleted) return deleted;
      } catch (err) {}
    }

    loadLocalStore();
    const index = localStore.findIndex(e => (e._id || e.id) == id);
    if (index === -1) return null;

    const removed = localStore.splice(index, 1)[0];
    saveLocalStore();
    return removed;
  },

  // Search emails by query across sender, subject, content
  async search(query) {
    const q = (query || '').toLowerCase().trim();
    if (!q) return this.find();

    if (!isFallbackMode()) {
      try {
        const results = await MongooseEmailModel.find({
          $or: [
            { senderName: { $regex: q, $options: 'i' } },
            { senderEmail: { $regex: q, $options: 'i' } },
            { subject: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { spamCategory: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }).sort({ date: -1 });
        return results;
      } catch (err) {}
    }

    loadLocalStore();
    return localStore.filter(e => {
      const matchSender = (e.senderName || '').toLowerCase().includes(q) || (e.senderEmail || '').toLowerCase().includes(q);
      const matchSubject = (e.subject || '').toLowerCase().includes(q);
      const matchContent = (e.content || '').toLowerCase().includes(q);
      const matchCategory = (e.spamCategory || '').toLowerCase().includes(q);
      const matchTags = Array.isArray(e.tags) && e.tags.some(t => t.toLowerCase().includes(q));
      return matchSender || matchSubject || matchContent || matchCategory || matchTags;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Count metrics for dashboard
  async getMetrics() {
    loadLocalStore();
    const all = await this.find({ isDeleted: false });
    
    const total = all.length;
    const unread = all.filter(e => !e.isRead && !e.isArchived).length;
    const important = all.filter(e => e.isImportant && !e.isArchived).length;
    const spam = all.filter(e => e.isSpam || e.spamCategory === 'SPAM' || e.spamCategory === 'PHISHING').length;
    const phishing = all.filter(e => e.spamCategory === 'PHISHING').length;
    const suspicious = all.filter(e => e.spamCategory === 'SUSPICIOUS').length;
    const safe = all.filter(e => e.spamCategory === 'SAFE').length;
    const archived = all.filter(e => e.isArchived).length;

    return {
      total,
      unread,
      important,
      spam,
      phishing,
      suspicious,
      safe,
      archived
    };
  },

  // Reset / Seed data
  async seedData() {
    const seedData = getProcessedSeedEmails();
    if (!isFallbackMode()) {
      try {
        await MongooseEmailModel.deleteMany({});
        await MongooseEmailModel.insertMany(seedData);
        console.log('✅ MongoDB database seeded with 14 sample emails');
      } catch (err) {
        console.warn('MongoDB seed failed, seeding local store:', err.message);
      }
    }

    localStore = [...seedData];
    saveLocalStore();
    console.log('✅ Local Store seeded with 14 sample emails');
    return seedData;
  }
};

module.exports = EmailRepository;
module.exports.MongooseEmailModel = MongooseEmailModel;
