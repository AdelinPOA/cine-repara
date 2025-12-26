-- Seed Romanian Locations
-- All 41 counties (județe) + Bucharest municipality
-- Major Romanian cities with population data

-- =====================================================
-- ROMANIAN REGIONS (JUDEȚE)
-- =====================================================

INSERT INTO regions (name, code, type) VALUES
-- Bucharest (Municipality)
('București', 'B', 'municipality'),

-- Counties (Județe) - alphabetically by code
('Alba', 'AB', 'county'),
('Arad', 'AR', 'county'),
('Argeș', 'AG', 'county'),
('Bacău', 'BC', 'county'),
('Bihor', 'BH', 'county'),
('Bistrița-Năsăud', 'BN', 'county'),
('Botoșani', 'BT', 'county'),
('Brăila', 'BR', 'county'),
('Brașov', 'BV', 'county'),
('Buzău', 'BZ', 'county'),
('Călărași', 'CL', 'county'),
('Caraș-Severin', 'CS', 'county'),
('Cluj', 'CJ', 'county'),
('Constanța', 'CT', 'county'),
('Covasna', 'CV', 'county'),
('Dâmbovița', 'DB', 'county'),
('Dolj', 'DJ', 'county'),
('Galați', 'GL', 'county'),
('Giurgiu', 'GR', 'county'),
('Gorj', 'GJ', 'county'),
('Harghita', 'HR', 'county'),
('Hunedoara', 'HD', 'county'),
('Ialomița', 'IL', 'county'),
('Iași', 'IS', 'county'),
('Ilfov', 'IF', 'county'),
('Maramureș', 'MM', 'county'),
('Mehedinți', 'MH', 'county'),
('Mureș', 'MS', 'county'),
('Neamț', 'NT', 'county'),
('Olt', 'OT', 'county'),
('Prahova', 'PH', 'county'),
('Sălaj', 'SJ', 'county'),
('Satu Mare', 'SM', 'county'),
('Sibiu', 'SB', 'county'),
('Suceava', 'SV', 'county'),
('Teleorman', 'TR', 'county'),
('Timiș', 'TM', 'county'),
('Tulcea', 'TL', 'county'),
('Vâlcea', 'VL', 'county'),
('Vaslui', 'VS', 'county'),
('Vrancea', 'VN', 'county');

-- =====================================================
-- MAJOR ROMANIAN CITIES
-- Population data based on 2021 census
-- =====================================================

-- București and Ilfov
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('București', (SELECT id FROM regions WHERE code = 'B'), 1716983, 44.4268, 26.1025),
('Buftea', (SELECT id FROM regions WHERE code = 'IF'), 22178, 44.5647, 25.9472),
('Voluntari', (SELECT id FROM regions WHERE code = 'IF'), 55000, 44.4794, 26.1856);

-- Alba
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Alba Iulia', (SELECT id FROM regions WHERE code = 'AB'), 63536, 46.0667, 23.5833),
('Sebeș', (SELECT id FROM regions WHERE code = 'AB'), 23281, 45.9597, 23.5681),
('Aiud', (SELECT id FROM regions WHERE code = 'AB'), 21852, 46.3097, 23.7203);

-- Arad
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Arad', (SELECT id FROM regions WHERE code = 'AR'), 159074, 46.1667, 21.3167);

-- Argeș
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Pitești', (SELECT id FROM regions WHERE code = 'AG'), 141275, 44.8667, 24.8667),
('Curtea de Argeș', (SELECT id FROM regions WHERE code = 'AG'), 29214, 45.1333, 24.6833),
('Câmpulung', (SELECT id FROM regions WHERE code = 'AG'), 32762, 45.2833, 25.0500);

-- Bacău
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Bacău', (SELECT id FROM regions WHERE code = 'BC'), 144307, 46.5667, 26.9167),
('Onești', (SELECT id FROM regions WHERE code = 'BC'), 44232, 46.2500, 26.7333);

-- Bihor
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Oradea', (SELECT id FROM regions WHERE code = 'BH'), 196367, 47.0667, 21.9333),
('Salonta', (SELECT id FROM regions WHERE code = 'BH'), 15674, 46.8000, 21.6500);

-- Bistrița-Năsăud
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Bistrița', (SELECT id FROM regions WHERE code = 'BN'), 71122, 47.1333, 24.5000);

-- Botoșani
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Botoșani', (SELECT id FROM regions WHERE code = 'BT'), 106847, 47.7500, 26.6667),
('Dorohoi', (SELECT id FROM regions WHERE code = 'BT'), 27759, 47.9667, 26.4000);

-- Brăila
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Brăila', (SELECT id FROM regions WHERE code = 'BR'), 180302, 45.2667, 27.9667);

-- Brașov
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Brașov', (SELECT id FROM regions WHERE code = 'BV'), 253200, 45.6500, 25.6000),
('Săcele', (SELECT id FROM regions WHERE code = 'BV'), 29967, 45.6167, 25.6833),
('Codlea', (SELECT id FROM regions WHERE code = 'BV'), 21708, 45.7000, 25.4500),
('Făgăraș', (SELECT id FROM regions WHERE code = 'BV'), 28330, 45.8500, 24.9667);

-- Buzău
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Buzău', (SELECT id FROM regions WHERE code = 'BZ'), 115494, 45.1500, 26.8167),
('Râmnicu Sărat', (SELECT id FROM regions WHERE code = 'BZ'), 33843, 45.3833, 27.0500);

-- Călărași
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Călărași', (SELECT id FROM regions WHERE code = 'CL'), 65181, 44.2000, 27.3333),
('Oltenița', (SELECT id FROM regions WHERE code = 'CL'), 31434, 44.0833, 26.6333);

-- Caraș-Severin
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Reșița', (SELECT id FROM regions WHERE code = 'CS'), 73282, 45.3000, 21.8833),
('Caransebeș', (SELECT id FROM regions WHERE code = 'CS'), 21531, 45.4167, 22.2167);

-- Cluj
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Cluj-Napoca', (SELECT id FROM regions WHERE code = 'CJ'), 286598, 46.7667, 23.6000),
('Turda', (SELECT id FROM regions WHERE code = 'CJ'), 47744, 46.5667, 23.7833),
('Dej', (SELECT id FROM regions WHERE code = 'CJ'), 31934, 47.1333, 23.8667),
('Câmpia Turzii', (SELECT id FROM regions WHERE code = 'CJ'), 23113, 46.5500, 23.8833);

-- Constanța
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Constanța', (SELECT id FROM regions WHERE code = 'CT'), 263688, 44.1833, 28.6333),
('Mangalia', (SELECT id FROM regions WHERE code = 'CT'), 36364, 43.8167, 28.5833),
('Medgidia', (SELECT id FROM regions WHERE code = 'CT'), 36291, 44.2500, 28.2667),
('Năvodari', (SELECT id FROM regions WHERE code = 'CT'), 39464, 44.3167, 28.6000);

-- Covasna
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Sfântu Gheorghe', (SELECT id FROM regions WHERE code = 'CV'), 52347, 45.8667, 25.7833),
('Târgu Secuiesc', (SELECT id FROM regions WHERE code = 'CV'), 17899, 45.9667, 26.1333);

-- Dâmbovița
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Târgoviște', (SELECT id FROM regions WHERE code = 'DB'), 73484, 44.9333, 25.4500),
('Moreni', (SELECT id FROM regions WHERE code = 'DB'), 18687, 44.9833, 25.6500);

-- Dolj
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Craiova', (SELECT id FROM regions WHERE code = 'DJ'), 269506, 44.3333, 23.8000),
('Băilești', (SELECT id FROM regions WHERE code = 'DJ'), 17437, 44.0167, 23.3500),
('Calafat', (SELECT id FROM regions WHERE code = 'DJ'), 15245, 43.9833, 22.9333);

-- Galați
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Galați', (SELECT id FROM regions WHERE code = 'GL'), 217851, 45.4333, 28.0500),
('Tecuci', (SELECT id FROM regions WHERE code = 'GL'), 34871, 45.8500, 27.4167);

-- Giurgiu
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Giurgiu', (SELECT id FROM regions WHERE code = 'GR'), 54655, 43.9000, 25.9667);

-- Gorj
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Târgu Jiu', (SELECT id FROM regions WHERE code = 'GJ'), 82504, 45.0500, 23.2833),
('Motru', (SELECT id FROM regions WHERE code = 'GJ'), 19079, 44.8000, 22.9667);

-- Harghita
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Miercurea Ciuc', (SELECT id FROM regions WHERE code = 'HR'), 34603, 46.3667, 25.8000),
('Odorheiu Secuiesc', (SELECT id FROM regions WHERE code = 'HR'), 33404, 46.3000, 25.2833);

-- Hunedoara
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Deva', (SELECT id FROM regions WHERE code = 'HD'), 56647, 45.8833, 22.9000),
('Hunedoara', (SELECT id FROM regions WHERE code = 'HD'), 60525, 45.7667, 22.9000),
('Petroșani', (SELECT id FROM regions WHERE code = 'HD'), 34331, 45.4167, 23.3667);

-- Ialomița
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Slobozia', (SELECT id FROM regions WHERE code = 'IL'), 45891, 44.5667, 27.3667),
('Fetești', (SELECT id FROM regions WHERE code = 'IL'), 30217, 44.3833, 27.8333);

-- Iași
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Iași', (SELECT id FROM regions WHERE code = 'IS'), 290422, 47.1667, 27.6000),
('Pașcani', (SELECT id FROM regions WHERE code = 'IS'), 33745, 47.2500, 26.7167);

-- Maramureș
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Baia Mare', (SELECT id FROM regions WHERE code = 'MM'), 108759, 47.6500, 23.5833),
('Sighetu Marmației', (SELECT id FROM regions WHERE code = 'MM'), 32553, 47.9333, 23.8833);

-- Mehedinți
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Drobeta-Turnu Severin', (SELECT id FROM regions WHERE code = 'MH'), 92617, 44.6333, 22.6667),
('Orșova', (SELECT id FROM regions WHERE code = 'MH'), 10441, 44.7167, 22.4000);

-- Mureș
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Târgu Mureș', (SELECT id FROM regions WHERE code = 'MS'), 134290, 46.5500, 24.5667),
('Reghin', (SELECT id FROM regions WHERE code = 'MS'), 30894, 46.7667, 24.7000),
('Sighișoara', (SELECT id FROM regions WHERE code = 'MS'), 23712, 46.2167, 24.8000);

-- Neamț
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Piatra Neamț', (SELECT id FROM regions WHERE code = 'NT'), 85055, 46.9333, 26.3667),
('Roman', (SELECT id FROM regions WHERE code = 'NT'), 50713, 46.9167, 26.9333);

-- Olt
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Slatina', (SELECT id FROM regions WHERE code = 'OT'), 63487, 44.4333, 24.3667),
('Caracal', (SELECT id FROM regions WHERE code = 'OT'), 28472, 44.1167, 24.3500);

-- Prahova
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Ploiești', (SELECT id FROM regions WHERE code = 'PH'), 201721, 44.9500, 26.0167),
('Câmpina', (SELECT id FROM regions WHERE code = 'PH'), 33615, 45.1333, 25.7333),
('Sinaia', (SELECT id FROM regions WHERE code = 'PH'), 10410, 45.3500, 25.5500),
('Buzău', (SELECT id FROM regions WHERE code = 'PH'), 25384, 45.2167, 26.1333);

-- Sălaj
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Zalău', (SELECT id FROM regions WHERE code = 'SJ'), 56202, 47.2000, 23.0500);

-- Satu Mare
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Satu Mare', (SELECT id FROM regions WHERE code = 'SM'), 102411, 47.8000, 22.8833),
('Carei', (SELECT id FROM regions WHERE code = 'SM'), 20042, 47.6833, 22.4667);

-- Sibiu
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Sibiu', (SELECT id FROM regions WHERE code = 'SB'), 147245, 45.8000, 24.1500),
('Mediaș', (SELECT id FROM regions WHERE code = 'SB'), 47204, 46.1667, 24.3500);

-- Suceava
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Suceava', (SELECT id FROM regions WHERE code = 'SV'), 92121, 47.6500, 26.2500),
('Botoșani', (SELECT id FROM regions WHERE code = 'SV'), 33900, 47.7333, 26.6667),
('Fălticeni', (SELECT id FROM regions WHERE code = 'SV'), 25291, 47.4667, 26.3000),
('Rădăuți', (SELECT id FROM regions WHERE code = 'SV'), 23822, 47.8500, 25.9167),
('Vatra Dornei', (SELECT id FROM regions WHERE code = 'SV'), 13659, 47.3500, 25.3667);

-- Teleorman
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Alexandria', (SELECT id FROM regions WHERE code = 'TR'), 45434, 43.9833, 25.3333),
('Roșiorii de Vede', (SELECT id FROM regions WHERE code = 'TR'), 23291, 44.1000, 24.9833);

-- Timiș
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Timișoara', (SELECT id FROM regions WHERE code = 'TM'), 319279, 45.7500, 21.2333),
('Lugoj', (SELECT id FROM regions WHERE code = 'TM'), 35315, 45.6833, 21.9000);

-- Tulcea
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Tulcea', (SELECT id FROM regions WHERE code = 'TL'), 65624, 45.1833, 28.8000);

-- Vâlcea
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Râmnicu Vâlcea', (SELECT id FROM regions WHERE code = 'VL'), 98776, 45.1000, 24.3667),
('Drăgășani', (SELECT id FROM regions WHERE code = 'VL'), 18234, 44.6500, 24.2667);

-- Vaslui
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Vaslui', (SELECT id FROM regions WHERE code = 'VS'), 55407, 46.6333, 27.7333),
('Bârlad', (SELECT id FROM regions WHERE code = 'VS'), 55837, 46.2333, 27.6667);

-- Vrancea
INSERT INTO cities (name, region_id, population, latitude, longitude) VALUES
('Focșani', (SELECT id FROM regions WHERE code = 'VN'), 79315, 45.7000, 27.1833),
('Adjud', (SELECT id FROM regions WHERE code = 'VN'), 15732, 46.1000, 27.1833);

-- =====================================================
-- STATISTICS
-- =====================================================

SELECT
  COUNT(DISTINCT r.id) as total_regions,
  COUNT(c.id) as total_cities,
  SUM(c.population) as total_population
FROM regions r
LEFT JOIN cities c ON r.id = c.region_id;
