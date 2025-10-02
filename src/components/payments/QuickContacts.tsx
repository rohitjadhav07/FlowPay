'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Star, Send, Edit, Trash2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  address: string;
  avatar?: string;
  isFavorite: boolean;
  lastTransactionAmount?: string;
  lastTransactionCurrency?: string;
  lastTransactionDate?: string;
}

export function QuickContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isFavorite: true,
      lastTransactionAmount: '500.00',
      lastTransactionCurrency: 'USD',
      lastTransactionDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Alice Smith',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      isFavorite: true,
      lastTransactionAmount: '1,200.00',
      lastTransactionCurrency: 'EUR',
      lastTransactionDate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      address: '0x9876543210fedcba9876543210fedcba98765432',
      isFavorite: false,
      lastTransactionAmount: '750.00',
      lastTransactionCurrency: 'GBP',
      lastTransactionDate: '2024-01-13'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      address: '0xfedcba0987654321fedcba0987654321fedcba09',
      isFavorite: false,
      lastTransactionAmount: '300.00',
      lastTransactionCurrency: 'USD',
      lastTransactionDate: '2024-01-12'
    }
  ]);

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', address: '' });

  const toggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };

  const addContact = () => {
    if (newContact.name && newContact.address) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        address: newContact.address,
        isFavorite: false
      };
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', address: '' });
      setShowAddContact(false);
    }
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  const favoriteContacts = contacts.filter(c => c.isFavorite);
  const recentContacts = contacts.filter(c => !c.isFavorite).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Contacts</h3>
        <button
          onClick={() => setShowAddContact(true)}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddContact && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-3">Add New Contact</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Contact name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Wallet address (0x...)"
              value={newContact.address}
              onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <button
                onClick={addContact}
                className="btn-primary text-sm px-4 py-2"
              >
                Add Contact
              </button>
              <button
                onClick={() => setShowAddContact(false)}
                className="btn-secondary text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Favorite Contacts */}
      {favoriteContacts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            Favorites
          </h4>
          <div className="space-y-2">
            {favoriteContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteContact}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Contacts */}
      {recentContacts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent</h4>
          <div className="space-y-2">
            {recentContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteContact}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm">No contacts yet</p>
          <p className="text-gray-500 text-xs mt-1">Add contacts for quick payments</p>
        </div>
      )}
    </motion.div>
  );
}

interface ContactCardProps {
  contact: Contact;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

function ContactCard({ contact, onToggleFavorite, onDelete }: ContactCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-600 font-medium text-sm">
            {contact.name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {contact.name}
            </p>
            {contact.isFavorite && (
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
            )}
          </div>
          <p className="text-xs text-gray-500 truncate font-mono">
            {contact.address}
          </p>
          {contact.lastTransactionAmount && (
            <p className="text-xs text-gray-400">
              Last: {contact.lastTransactionAmount} {contact.lastTransactionCurrency}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {showActions ? (
          <>
            <button
              onClick={() => onToggleFavorite(contact.id)}
              className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
              title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${contact.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete contact"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}