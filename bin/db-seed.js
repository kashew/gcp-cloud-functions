require('dotenv').config()
const pgp = require('pg-promise')()
const db = pgp(process.env.DATABASE_URL)

const insertAgentFeedItem = `
  INSERT INTO agent_feed_items(user_uuid, sort_order, occurred_at_key, search, payload, created_at, updated_at, card_type, scope)
  VALUES(
    'f0f9d80c-0668-4a28-98d0-48b936f2f5bf',
    304,
    '20210511',
    'Kenneth Brown 5408486209',
    '{}',
    '2021-07-27T15:30:00.000',
    '2021-07-27T15:30:15.000',
    'lead',
    'agent'
  );
`;

(async () => {
  await db.none(insertAgentFeedItem);
})()