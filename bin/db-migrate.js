const pgp = require('pg-promise')()

require('dotenv').config()

const db = pgp(process.env.DATABASE_URL)

const createTables = async (db) => {
  const queryCardScope = `
    CREATE TYPE public.agent_card_scope AS ENUM (
      'agent',
      'global'
    );
  `
  const queryCartType = `
    CREATE TYPE public.agent_card_type AS ENUM (
      'lead',
      'policy',
      'info'
    );
  `
  const queryCreateTable = `
    CREATE TABLE IF NOT EXISTS public.agent_feed_items (
      id bigint NOT NULL,
      user_uuid uuid,
      sort_order double precision,
      occurred_at_key integer,
      search character varying,
      payload json,
      created_at timestamp(6) without time zone NOT NULL,
      updated_at timestamp(6) without time zone NOT NULL,
      card_type public.agent_card_type,
      scope public.agent_card_scope
    );
  `

  const queryCreateSequence = `
    CREATE SEQUENCE public.agent_feed_items_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;
  `

  const queryChangeSeqOwner = `
    ALTER SEQUENCE public.agent_feed_items_id_seq OWNED BY public.agent_feed_items.id;
  `

  const queryAlterColId = `
    ALTER TABLE ONLY public.agent_feed_items ALTER COLUMN id SET DEFAULT nextval('public.agent_feed_items_id_seq'::regclass);
  `

  const queryAddConstraint = `
    ALTER TABLE ONLY public.agent_feed_items
      ADD CONSTRAINT agent_feed_items_pkey PRIMARY KEY (id);
  `

  try {
    await db.tx(async t => {
      await t.none(queryCardScope)
      await t.none(queryCartType)
      await t.none(queryCreateTable)
      await t.none(queryCreateSequence)
      await t.none(queryChangeSeqOwner)
      await t.none(queryAlterColId)
      await t.none(queryAddConstraint)
    })
  } catch (e) {
    console.log(e)
  }
}

(async () => {
  await createTables(db)
})()
