import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Phone, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';
import emergencyService from '../services/emergencyService';

const EmergencyContactsSettings = ({ onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', relationship: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    emergencyService.loadEmergencyContacts();
    const loadedContacts = emergencyService.emergencyContacts || [];
    setContacts(loadedContacts);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingContact(null);
    setFormData({ name: '', phone: '', email: '', relationship: '' });
  };

  const handleEdit = (contact) => {
    setEditingContact(contact.id);
    setIsAddingNew(false);
    setFormData({
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || '',
      relationship: contact.relationship || ''
    });
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingContact(null);
    setFormData({ name: '', phone: '', email: '', relationship: '' });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      showNotification('Please enter a name', 'error');
      return;
    }

    if (!formData.phone.trim()) {
      showNotification('Please enter a phone number', 'error');
      return;
    }

    if (editingContact) {
      // Update existing contact
      const updatedContacts = contacts.map(c =>
        c.id === editingContact ? { ...c, ...formData } : c
      );
      emergencyService.saveEmergencyContacts(updatedContacts);
      setContacts(updatedContacts);
      showNotification('Contact updated successfully');
    } else {
      // Add new contact
      const newContact = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      const updatedContacts = [...contacts, newContact];
      emergencyService.saveEmergencyContacts(updatedContacts);
      setContacts(updatedContacts);
      showNotification('Contact added successfully');
    }

    handleCancel();
  };

  const handleDelete = (contactId) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      emergencyService.saveEmergencyContacts(updatedContacts);
      setContacts(updatedContacts);
      showNotification('Contact deleted');
    }
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-black/90 border-b border-gray-950 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Emergency Contacts</h1>
                <p className="text-xs text-gray-500">Manage your safety network</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-gray-800 transition-all border border-gray-800"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-950/90 border border-emerald-800/50' : 'bg-red-950/90 border border-red-800/50'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={notification.type === 'success' ? 'text-emerald-200' : 'text-red-200'}>
            {notification.message}
          </span>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">These contacts will receive SMS alerts when threats are detected by Audio Shield.</p>
              <p className="text-xs text-gray-400">Messages include your location, threat details, and audio transcript.</p>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        {!isAddingNew && !editingContact && (
          <button
            onClick={handleAddNew}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Emergency Contact
          </button>
        )}

        {/* Add/Edit Form */}
        {(isAddingNew || editingContact) && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingContact ? 'Edit Contact' : 'New Contact'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Relationship</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Friend, Family, Partner, etc."
                  className="w-full bg-black/60 border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Contact
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 bg-gray-800 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Emergency Contacts</h3>
              <p className="text-sm text-gray-500">Add contacts to receive alerts during emergencies</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{contact.name}</h3>
                      {contact.relationship && (
                        <span className="text-xs bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-900/30">
                          {contact.relationship}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{formatPhoneNumber(contact.phone)}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="w-9 h-9 bg-red-950/40 border border-red-900/30 rounded-lg flex items-center justify-center hover:bg-red-950/60 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsSettings;
