-- Drug Validation Data
-- ===================

CREATE TABLE IF NOT EXISTS drugs (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  strength VARCHAR(50),
  formulation VARCHAR(100),
  unit_price DECIMAL(10,2),
  payer VARCHAR(50),
  quantity INTEGER
);

INSERT INTO drugs (id, name, strength, formulation, unit_price, payer, quantity) VALUES (1, 'Amoxicillin', '500 mg', 'Capsule', 0.6, 'medicaid', 30);
INSERT INTO drugs (id, name, strength, formulation, unit_price, payer, quantity) VALUES (2, 'Lisinopril', '10 mg', 'Capsule', 0.3, 'medicaid', 30);
INSERT INTO drugs (id, name, strength, formulation, unit_price, payer, quantity) VALUES (3, 'Metformin', '1000 mg', 'Tablet (ER)', 0.15, 'medicare', 60);
