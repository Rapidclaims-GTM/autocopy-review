// AutoCopy Review App Configuration
// Update WEBHOOK_URL after deploying Google Apps Script
const CONFIG = {
  WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbx1Le9aFZOG9otiAEpRSRDW4eGSrDBjvCQ6UmN-nTtkVAEaWhQllqgVGgyH6VzVIlMtkA/exec',
  REVIEWERS: ['prahalad', 'rahul', 'vinayak', 'sheetal', 'ameya', 'aditya', 'vaibhav'],
  REVIEWER_DISPLAY: {
    'prahalad': 'Prahalad',
    'rahul': 'Rahul',
    'vinayak': 'Vinayak',
    'sheetal': 'Sheetal',
    'ameya': 'Ameya',
    'aditya': 'Aditya',
    'vaibhav': 'Vaibhav'
  },
  ASPECT_OPTIONS: [
    { id: 'subject', label: 'Subject Line' },
    { id: 'hook', label: 'Opening Hook' },
    { id: 'cta', label: 'CTA' },
    { id: 'tone', label: 'Tone' },
    { id: 'flow', label: 'Sequence Flow' },
    { id: 'length', label: 'Length' },
    { id: 'everything', label: 'Everything' }
  ]
};
