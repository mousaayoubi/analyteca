CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	email text UNIQUE NOT NULL,
	password_hash text NOT NULL,
	role text NOT NULL DEFAULT 'admin',
	created_at timestamptz NOT NULL DEFAULT now()
	);

CREATE TABLE IF NOT EXISTS sync_runs (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	started_at timestamptz NOT NULL DEFAULT now(),
	finished_at timestamptz,
	status text NOT NULL DEFAULT 'running',
	message text
	);

CREATE TABLE IF NOT EXISTS metrics_daily (
	day date PRIMARY KEY,
	revenue numeric(12,2) NOT NULL DEFAULT 0,
	orders int NOT NULL DEFAULT 0,
	aov numeric(12,2) NOT NULL DEFAULT 0,
	refunds numeric(12,2) NOT NULL DEFAULT 0
	);

CREATE TABLE IF NOT EXISTS top_products_daily (
	day date NOT NULL,
	sku text NOT NULL,
	name text,
	qty numeric(12,2) NOT NULL DEFAULT 0,
	revenue numeric(12,2) NOT NULL DEFAULT 0,
	PRIMARY KEY (day, sku)
	);
