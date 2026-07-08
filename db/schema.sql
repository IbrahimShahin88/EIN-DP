CREATE TABLE IF NOT EXISTS clients (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sites (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  client_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sites_client_id (client_id)
);

CREATE TABLE IF NOT EXISTS zones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  site_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_zones_site_id (site_id)
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  zone_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  location_note TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_checkpoints_zone_id (zone_id)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  site_id BIGINT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_site_id (site_id),
  INDEX idx_users_role (role)
);

CREATE TABLE IF NOT EXISTS tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  site_id BIGINT NOT NULL,
  checkpoint_id BIGINT,
  assigned_to BIGINT,
  created_by BIGINT,
  task_type VARCHAR(50) DEFAULT 'patrol',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'normal',
  status VARCHAR(50) DEFAULT 'pending',
  due_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tasks_site_id (site_id),
  INDEX idx_tasks_assigned_to (assigned_to),
  INDEX idx_tasks_task_type (task_type),
  INDEX idx_tasks_status (status)
);

CREATE TABLE IF NOT EXISTS task_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  task_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  action VARCHAR(100) NOT NULL,
  note TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_task_logs_task_id (task_id),
  INDEX idx_task_logs_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS incidents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  site_id BIGINT NOT NULL,
  reported_by BIGINT NOT NULL,
  checkpoint_id BIGINT,
  incident_type VARCHAR(100) DEFAULT 'general',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  action_taken TEXT,
  escalation_status VARCHAR(50) DEFAULT 'none',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  INDEX idx_incidents_site_id (site_id),
  INDEX idx_incidents_status (status),
  INDEX idx_incidents_severity (severity)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id BIGINT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_user_id (user_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS qr_checkins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  checkpoint_id BIGINT NOT NULL,
  task_id BIGINT,
  guard_id BIGINT NOT NULL,
  qr_code VARCHAR(255) NOT NULL,
  note TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  is_late BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_qr_checkins_checkpoint_id (checkpoint_id),
  INDEX idx_qr_checkins_task_id (task_id),
  INDEX idx_qr_checkins_guard_id (guard_id),
  INDEX idx_qr_checkins_checked_at (checked_at)
);
