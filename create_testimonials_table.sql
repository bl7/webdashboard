-- Client testimonials collected via the public (unlisted) /testimonial form
-- Run against PostgreSQL before deploying /api/testimonials

CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  company VARCHAR(255),
  role VARCHAR(255),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  source VARCHAR(64) DEFAULT 'web',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials (created_at DESC);

COMMENT ON TABLE testimonials IS 'Client testimonials submitted through the public unlisted /testimonial form.';
COMMENT ON COLUMN testimonials.consent IS 'Client agreed to let us publish their testimonial.';
COMMENT ON COLUMN testimonials.approved IS 'Boss-approved for public display.';
