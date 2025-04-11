import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BIBLE_API_URL;

export const BibleAPI = {
  async getVerse(reference, version = 'NIV') {
    try {
      // In production, replace with actual API call
      console.log(`Fetching ${reference} in ${version}`);
      
      // Mock implementation
      const mockVerses = {
        'John 3:16': {
          NIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
          ESV: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
        },
        'Psalm 23:1': {
          NIV: 'The LORD is my shepherd, I lack nothing.',
          KJV: 'The LORD is my shepherd; I shall not want.',
          ESV: 'The LORD is my shepherd; I shall not want.',
        },
      };

      const verseText = mockVerses[reference]?.[version] || 
                       `"${reference}" (${version}) - Verse would display in production`;

      return { text: verseText, reference, version };
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      throw new Error('Failed to fetch Bible verse');
    }
  },

  async searchReferences(query) {
    try {
      // Mock implementation - replace with actual API call
      const allReferences = [
        'John 3:16',
        'Psalm 23:1',
        'Romans 8:28',
        'Philippians 4:13',
        'Matthew 11:28',
        'Proverbs 3:5-6',
        'Isaiah 40:31',
        'Jeremiah 29:11'
      ];

      return allReferences.filter(ref => 
        ref.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching references:', error);
      throw new Error('Failed to search Bible references');
    }
  }
};