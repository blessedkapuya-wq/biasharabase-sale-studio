import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const licenses = pgTable('licenses', {
  id: serial('id').primaryKey(),
  buyerEmail: text('buyer_email').notNull(),
  buyerName: text('buyer_name').notNull().default(''),
  selarOrderId: text('selar_order_id').notNull().unique(),
  licenseKey: text('license_key').notNull().unique(),
  amountPaid: text('amount_paid').notNull().default(''),
  currency: text('currency').notNull().default('USD'),
  status: text('status').notNull().default('active'),
  maxDevices: integer('max_devices').notNull().default(3),
  source: text('source').notNull().default('selar-webhook'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deviceActivations = pgTable(
  'device_activations',
  {
    id: serial('id').primaryKey(),
    licenseId: integer('license_id')
      .references(() => licenses.id, { onDelete: 'cascade' })
      .notNull(),
    deviceId: text('device_id').notNull(),
    userAgent: text('user_agent').notNull().default(''),
    firstSeenAt: timestamp('first_seen_at').defaultNow().notNull(),
    lastSeenAt: timestamp('last_seen_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('device_activations_license_device_idx').on(
      table.licenseId,
      table.deviceId
    ),
  ]
);

export const licensesRelations = relations(licenses, ({ many }) => ({
  activations: many(deviceActivations),
}));

export const deviceActivationsRelations = relations(
  deviceActivations,
  ({ one }) => ({
    license: one(licenses, {
      fields: [deviceActivations.licenseId],
      references: [licenses.id],
    }),
  })
);
