/**
 * Database TypeScript Types
 * Generated from PostgreSQL schema
 */

// =====================================================
// USER TYPES
// =====================================================

export type UserRole = 'customer' | 'installer';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserInsert extends Omit<User, 'id' | 'created_at' | 'updated_at' | 'email_verified'> {
  email_verified?: boolean;
}

export interface UserUpdate extends Partial<Omit<User, 'id' | 'email' | 'password_hash' | 'role' | 'created_at' | 'updated_at'>> {}

// =====================================================
// SERVICE CATEGORY TYPES
// =====================================================

export interface ServiceCategory {
  id: number;
  name_ro: string;
  name_en: string | null;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  is_active: boolean;
  display_order: number;
  created_at: Date;
  is_primary?: boolean; // Added for query results from installer_services join
}

export interface ServiceCategoryInsert extends Omit<ServiceCategory, 'id' | 'created_at'> {}

// =====================================================
// LOCATION TYPES
// =====================================================

export type RegionType = 'county' | 'municipality';

export interface Region {
  id: number;
  name: string;
  code: string;
  type: RegionType;
  created_at: Date;
}

export interface City {
  id: number;
  name: string;
  region_id: number;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  created_at: Date;
  region_name?: string; // Added for query results with region join
}

// =====================================================
// INSTALLER TYPES
// =====================================================

export interface InstallerProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  bio: string | null;
  years_experience: number | null;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  is_verified: boolean;
  is_available: boolean;
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InstallerProfileInsert extends Omit<InstallerProfile, 'id' | 'created_at' | 'updated_at'> {}

export interface InstallerProfileUpdate extends Partial<Omit<InstallerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>> {}

export interface InstallerService {
  id: number;
  installer_profile_id: string;
  service_category_id: number;
  is_primary: boolean;
  created_at: Date;
}

export interface InstallerServiceArea {
  id: number;
  installer_profile_id: string;
  city_id: number;
  created_at: Date;
}

export interface InstallerCertification {
  id: number;
  installer_profile_id: string;
  name: string;
  issuing_authority: string | null;
  issue_date: Date | null;
  expiry_date: Date | null;
  certificate_url: string | null;
  created_at: Date;
}

export interface PortfolioImage {
  id: number;
  installer_profile_id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  service_category_id: number | null;
  display_order: number;
  created_at: Date;
}

// =====================================================
// REVIEW TYPES
// =====================================================

export interface Review {
  id: string;
  installer_profile_id: string;
  customer_id: string;
  service_category_id: number | null;
  rating: number;
  title: string | null;
  comment: string | null;
  work_completed_at: Date | null;
  is_verified: boolean;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewInsert extends Omit<Review, 'id' | 'created_at' | 'updated_at' | 'is_verified' | 'helpful_count'> {
  is_verified?: boolean;
  helpful_count?: number;
}

export interface ReviewUpdate extends Partial<Omit<Review, 'id' | 'installer_profile_id' | 'customer_id' | 'created_at' | 'updated_at'>> {}

export interface ReviewImage {
  id: number;
  review_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: Date;
}

// =====================================================
// NEXTAUTH TYPES
// =====================================================

export interface Session {
  id: string;
  session_token: string;
  user_id: string;
  expires: Date;
}

export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

// =====================================================
// VIEW TYPES
// =====================================================

export interface InstallerSummary {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  business_name: string | null;
  bio: string | null;
  years_experience: number | null;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  is_verified: boolean;
  is_available: boolean;
  profile_completed: boolean;
  review_count: number;
  average_rating: number;
  service_area_count: number;
  service_count: number;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// JOINED/EXTENDED TYPES
// =====================================================

export interface InstallerWithDetails extends InstallerSummary {
  services: ServiceCategory[];
  service_areas: City[];
  certifications: InstallerCertification[];
  portfolio: PortfolioImage[];
}

export interface ReviewWithAuthor extends Review {
  customer_name: string;
  customer_avatar: string | null;
  images: ReviewImage[];
}

export interface CityWithRegion extends City {
  region: Region;
}
