-- Seed Romanian Service Categories
-- Both specialized and general handyman services

-- =====================================================
-- MAIN SERVICE CATEGORIES
-- =====================================================

-- Specialized Services
INSERT INTO service_categories (name_ro, name_en, slug, icon, display_order) VALUES
('Instalator Termic și Sanitar', 'Heating and Plumbing Installer', 'instalator-termic-sanitar', 'wrench', 1),
('Electrician', 'Electrician', 'electrician', 'bolt', 2),
('Instalații HVAC', 'HVAC Installations', 'instalatii-hvac', 'fan', 3),
('Instalator Gaze', 'Gas Installer', 'instalator-gaze', 'flame', 4),
('Instalații Sanitare', 'Sanitary Installations', 'instalatii-sanitare', 'droplet', 5),
('Zugrav și Vopsitor', 'Painter and Decorator', 'zugrav-vopsitor', 'paint-roller', 6),
('Tâmplar', 'Carpenter', 'tamplar', 'hammer', 7),
('Fierar-Betonist', 'Reinforcement Worker', 'fierar-betonist', 'building', 8),
('Zidar', 'Mason', 'zidar', 'brick', 9),
('Pavator', 'Tiler', 'pavator', 'grid', 10),
('Acoperișuri', 'Roofing', 'acoperisuri', 'home', 11),
('Geamgiu', 'Glazier', 'geamgiu', 'square', 12);

-- General Services
INSERT INTO service_categories (name_ro, name_en, slug, icon, display_order) VALUES
('Meșter Universal', 'General Handyman', 'mester-universal', 'tools', 13),
('Reparații Generale', 'General Repairs', 'reparatii-generale', 'tool', 14),
('Întreținere Casă', 'Home Maintenance', 'intretinere-casa', 'home-check', 15),
('Montaj Mobilier', 'Furniture Assembly', 'montaj-mobilier', 'furniture', 16);

-- =====================================================
-- SUBCATEGORIES (with parent_id)
-- =====================================================

-- Plumbing subcategories
INSERT INTO service_categories (name_ro, name_en, slug, icon, parent_id, display_order) VALUES
('Instalare Centrală Termică', 'Boiler Installation', 'instalare-centrala-termica', 'heating',
  (SELECT id FROM service_categories WHERE slug = 'instalator-termic-sanitar'), 1),
('Reparații Țevi', 'Pipe Repairs', 'reparatii-tevi', 'pipe',
  (SELECT id FROM service_categories WHERE slug = 'instalator-termic-sanitar'), 2),
('Instalare Radiatoare', 'Radiator Installation', 'instalare-radiatoare', 'radiator',
  (SELECT id FROM service_categories WHERE slug = 'instalator-termic-sanitar'), 3);

-- Electrical subcategories
INSERT INTO service_categories (name_ro, name_en, slug, icon, parent_id, display_order) VALUES
('Instalații Electrice Noi', 'New Electrical Installations', 'instalatii-electrice-noi', 'lightning',
  (SELECT id FROM service_categories WHERE slug = 'electrician'), 1),
('Reparații Electrice', 'Electrical Repairs', 'reparatii-electrice', 'zap',
  (SELECT id FROM service_categories WHERE slug = 'electrician'), 2),
('Montaj Prize și Întrerupătoare', 'Socket and Switch Installation', 'montaj-prize-intrerupatoare', 'plug',
  (SELECT id FROM service_categories WHERE slug = 'electrician'), 3);

-- HVAC subcategories
INSERT INTO service_categories (name_ro, name_en, slug, icon, parent_id, display_order) VALUES
('Instalare Aer Condiționat', 'Air Conditioning Installation', 'instalare-aer-conditionat', 'snowflake',
  (SELECT id FROM service_categories WHERE slug = 'instalatii-hvac'), 1),
('Mentenanță HVAC', 'HVAC Maintenance', 'mentenanta-hvac', 'settings',
  (SELECT id FROM service_categories WHERE slug = 'instalatii-hvac'), 2),
('Ventilație', 'Ventilation', 'ventilatie', 'wind',
  (SELECT id FROM service_categories WHERE slug = 'instalatii-hvac'), 3);

-- Painting subcategories
INSERT INTO service_categories (name_ro, name_en, slug, icon, parent_id, display_order) VALUES
('Vopsit Interior', 'Interior Painting', 'vopsit-interior', 'home',
  (SELECT id FROM service_categories WHERE slug = 'zugrav-vopsitor'), 1),
('Vopsit Exterior', 'Exterior Painting', 'vopsit-exterior', 'building',
  (SELECT id FROM service_categories WHERE slug = 'zugrav-vopsitor'), 2),
('Zugrăvit și Șpaclu', 'Plastering and Painting', 'zugravit-spaclu', 'fill',
  (SELECT id FROM service_categories WHERE slug = 'zugrav-vopsitor'), 3);

-- Carpentry subcategories
INSERT INTO service_categories (name_ro, name_en, slug, icon, parent_id, display_order) VALUES
('Montaj Uși', 'Door Installation', 'montaj-usi', 'door-open',
  (SELECT id FROM service_categories WHERE slug = 'tamplar'), 1),
('Montaj Ferestre', 'Window Installation', 'montaj-ferestre', 'window',
  (SELECT id FROM service_categories WHERE slug = 'tamplar'), 2),
('Mobilier la Comandă', 'Custom Furniture', 'mobilier-comanda', 'furniture',
  (SELECT id FROM service_categories WHERE slug = 'tamplar'), 3);

-- =====================================================
-- STATISTICS
-- =====================================================

-- Show category count
SELECT
  COUNT(*) FILTER (WHERE parent_id IS NULL) as main_categories,
  COUNT(*) FILTER (WHERE parent_id IS NOT NULL) as subcategories,
  COUNT(*) as total_categories
FROM service_categories;
