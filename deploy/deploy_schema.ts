// Simplified schema for production deployment
import { list } from '@keystone-6/core';
import { text, relationship, checkbox, integer, timestamp, password } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      // Remove relationship fields that cause issues
    },
  }),
  
  Paper: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      authors: text({ validation: { isRequired: true } }),
      journal: text(),
      year: integer({ validation: { isRequired: true } }),
      doi: text(),
      url: text(),
      abstract: text({ ui: { displayMode: 'textarea' } }),
      isCurrentlyReading: checkbox({ defaultValue: false }),
      readingStatus: text(),
      // Remove relationship fields that cause issues
    },
    ui: {
      labelField: 'title',
      listView: {
        initialColumns: ['title', 'authors', 'year', 'isCurrentlyReading'],
      },
    },
  }),
  
  Update: list({
    access: allowAll,
    fields: {
      paperTitle: text({ validation: { isRequired: true } }),
      message: text({ validation: { isRequired: true } }),
      timestamp: timestamp({ defaultValue: { kind: 'now' } }),
      readingStatus: text(),
      // Remove relationship fields that cause issues
    },
    ui: {
      labelField: 'message',
      listView: {
        initialColumns: ['paperTitle', 'message', 'timestamp'],
      },
    },
  }),
}; 