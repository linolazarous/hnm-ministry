import { useState, useEffect } from 'react';
import { BroadcastAPI } from '../services/BroadcastAPI';

export const useBroadcast = () => {
  const [broadcastState, setBroadcastState] = useState({
    showNotes: false,
    notes: '',
    showBible: false,
    bibleVerse: '',
    bibleReference: '',
    translation: 'NIV',
    lowerThird: {
      visible: false,
      title: '',
      subtitle: '',
      color: '#4a6fa5'
    },
    countdown: {
      visible: false,
      targetTime: null,
      title: ''
    },
    preset: null
  });

  const updateBroadcast = (updates) => {
    setBroadcastState(prev => {
      const newState = { ...prev, ...updates };
      
      // Auto-save to server
      BroadcastAPI.updateState(newState).catch(err => {
        console.error('Failed to update server state:', err);
      });
      
      return newState;
    });
  };

  const syncWithServer = (serverState) => {
    setBroadcastState(serverState);
  };

  return { broadcastState, updateBroadcast, syncWithServer };
};