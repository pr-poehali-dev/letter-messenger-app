
CREATE TABLE IF NOT EXISTS t_p8308112_letter_messenger_app.invite_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  owner_id INTEGER NOT NULL REFERENCES t_p8308112_letter_messenger_app.users(id),
  used_by INTEGER REFERENCES t_p8308112_letter_messenger_app.users(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON t_p8308112_letter_messenger_app.invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_owner ON t_p8308112_letter_messenger_app.invite_codes(owner_id);

ALTER TABLE t_p8308112_letter_messenger_app.users
  ADD COLUMN IF NOT EXISTS invite_code_id INTEGER REFERENCES t_p8308112_letter_messenger_app.invite_codes(id);
