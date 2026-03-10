// =============================================================================
// CHALDEAN NUMEROLOGY ENDPOINT METADATA
// Data-driven config powering all category pages and forms
// =============================================================================

import type { LucideIcon } from 'lucide-react';
import {
    Baby, Hash, Heart, Briefcase, Clock, Building2,
    Sparkles, Package, Fingerprint, Sun, Calculator,
    Phone, Car, Home, CreditCard, Lock,
    Flame, Users, UserCheck, UserX, HeartHandshake,
    CalendarSearch, CalendarClock, Star, Zap, Moon,
    TrendingUp, Gem, LayoutGrid, Layers, Music,
    Palette, Shield, Wallet, GraduationCap, Scale,
    Plane, Activity, FileText, Compass, Globe,
    Target, Lightbulb, Wand2,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export type NumerologyInputType =
    | 'base'          // full_name + birth_date
    | 'twoPerson'     // Two person compatibility
    | 'family'        // Primary + dynamic member list
    | 'team'          // Team name + dynamic member list
    | 'business'      // Business-specific fields
    | 'dateRange'     // Date range + purpose
    | 'number'        // Number field + owner fields
    | 'custom';       // Endpoint-specific form

export interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
}

export interface NumerologyEndpointMeta {
    slug: string;
    name: string;
    description: string;
    icon: LucideIcon;
    inputType: NumerologyInputType;
    extraFields?: FieldConfig[];
}

export interface ChaldeanCategoryMeta {
    key: string;
    name: string;
    icon: LucideIcon;
    path: string;
    count: number;
    description: string;
}

// =============================================================================
// CATEGORIES (10)
// =============================================================================

export const CHALDEAN_CATEGORIES: ChaldeanCategoryMeta[] = [
    { key: 'naming', name: 'Naming', icon: Baby, path: '/numerology/chaldean/naming', count: 5, description: 'Baby names, personal name analysis, and name change guidance' },
    { key: 'numbers', name: 'Numbers', icon: Hash, path: '/numerology/chaldean/numbers', count: 6, description: 'Mobile, vehicle, house, bank account & PIN analysis' },
    { key: 'relationships', name: 'Relationships', icon: Heart, path: '/numerology/chaldean/relationships', count: 10, description: 'Love, marriage, family, and friendship compatibility' },
    { key: 'career', name: 'Career', icon: Briefcase, path: '/numerology/chaldean/career', count: 4, description: 'Career path, job timing, boss & team compatibility' },
    { key: 'timing', name: 'Timing', icon: Clock, path: '/numerology/chaldean/timing', count: 10, description: 'Daily, weekly, monthly forecasts & auspicious moments' },
    { key: 'business', name: 'Business', icon: Building2, path: '/numerology/chaldean/business', count: 12, description: 'Business naming, branding, partnerships & store location' },
    { key: 'spiritual', name: 'Spiritual', icon: Sparkles, path: '/numerology/chaldean/spiritual', count: 6, description: 'Karmic debt, life lessons, chakra alignment & past life' },
    { key: 'packages', name: 'Packages', icon: Package, path: '/numerology/chaldean/packages', count: 11, description: 'Comprehensive multi-analysis packages for life events' },
    { key: 'unique', name: 'Unique', icon: Fingerprint, path: '/numerology/chaldean/unique', count: 8, description: 'Signatures, emails, social media & lucky numbers' },
    { key: 'daily', name: 'Daily', icon: Sun, path: '/numerology/chaldean/daily', count: 3, description: 'Daily lucky colors, energy forecast & emotional balance' },
];

// =============================================================================
// SERVICE ENDPOINTS BY CATEGORY
// =============================================================================

export const CHALDEAN_ENDPOINTS: Record<string, NumerologyEndpointMeta[]> = {
    naming: [
        {
            slug: 'baby-name-analyze', name: 'Baby Name Analyzer', icon: Baby, inputType: 'custom',
            description: 'Analyze a baby name for numerological compatibility with parents',
            extraFields: [
                { name: 'baby_name', label: 'Baby Name', type: 'text', required: true, placeholder: 'Enter baby name' },
                { name: 'baby_birth_date', label: 'Baby Birth Date', type: 'date', required: true },
                { name: 'baby_gender', label: 'Gender', type: 'select', options: [{ value: '', label: 'Select' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
                { name: 'father_name', label: 'Father Name', type: 'text', placeholder: 'Optional' },
                { name: 'father_birth_date', label: 'Father Birth Date', type: 'date' },
                { name: 'mother_name', label: 'Mother Name', type: 'text', placeholder: 'Optional' },
                { name: 'mother_birth_date', label: 'Mother Birth Date', type: 'date' },
            ],
        },
        {
            slug: 'baby-name-variations', name: 'Baby Name Variations', icon: Baby, inputType: 'custom',
            description: 'Generate numerologically optimized spelling variations',
            extraFields: [
                { name: 'baby_name', label: 'Baby Name', type: 'text', required: true, placeholder: 'Base name' },
                { name: 'baby_birth_date', label: 'Baby Birth Date', type: 'date', required: true },
                { name: 'max_variations', label: 'Max Variations', type: 'number', placeholder: '10' },
            ],
        },
        {
            slug: 'baby-name-generate', name: 'Baby Name Generator', icon: Wand2, inputType: 'custom',
            description: 'Generate numerologically favorable baby names',
            extraFields: [
                { name: 'baby_birth_date', label: 'Baby Birth Date', type: 'date', required: true },
                { name: 'baby_gender', label: 'Gender', type: 'select', required: true, options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
                { name: 'cultural_preference', label: 'Cultural Preference', type: 'text', placeholder: 'e.g. Hindu, Islamic, Modern' },
                { name: 'father_name', label: 'Father Name', type: 'text' },
                { name: 'father_birth_date', label: 'Father Birth Date', type: 'date' },
                { name: 'mother_name', label: 'Mother Name', type: 'text' },
                { name: 'mother_birth_date', label: 'Mother Birth Date', type: 'date' },
                { name: 'target_number', label: 'Target Number', type: 'number', placeholder: '1-9' },
            ],
        },
        {
            slug: 'personal-name-analyze', name: 'Personal Name Analysis', icon: FileText, inputType: 'base',
            description: 'Deep analysis of your full name vibration and destiny',
        },
        {
            slug: 'name-change-analyze', name: 'Name Change Analysis', icon: Wand2, inputType: 'custom',
            description: 'Analyze the impact of changing your name',
            extraFields: [
                { name: 'current_name', label: 'Current Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'new_name', label: 'Proposed New Name', type: 'text', placeholder: 'Leave empty for suggestions' },
            ],
        },
    ],

    numbers: [
        { slug: 'birth-number-analyze', name: 'Birth Number Analysis', icon: Hash, inputType: 'custom', description: 'Analyze your birth date number vibration',
            extraFields: [
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'mobile-analyze', name: 'Mobile Number Analysis', icon: Phone, inputType: 'custom', description: 'Check if your mobile number is numerologically favorable',
            extraFields: [
                { name: 'mobile_number', label: 'Mobile Number', type: 'text', required: true, placeholder: 'e.g. 9876543210' },
                { name: 'birth_date', label: 'Owner Birth Date', type: 'date', required: true },
            ],
        },
        { slug: 'vehicle-analyze', name: 'Vehicle Number Analysis', icon: Car, inputType: 'custom', description: 'Analyze your vehicle registration number',
            extraFields: [
                { name: 'vehicle_number', label: 'Vehicle Number', type: 'text', required: true, placeholder: 'e.g. KA01AB1234' },
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: [{ value: '', label: 'Select' }, { value: 'car', label: 'Car' }, { value: 'bike', label: 'Bike' }, { value: 'truck', label: 'Truck' }, { value: 'other', label: 'Other' }] },
            ],
        },
        { slug: 'house-analyze', name: 'House Number Analysis', icon: Home, inputType: 'custom', description: 'Analyze your house or apartment number energy',
            extraFields: [
                { name: 'house_number', label: 'House Number', type: 'text', required: true, placeholder: 'e.g. 42A' },
                { name: 'street_name', label: 'Street Name', type: 'text', placeholder: 'Optional' },
                { name: 'apartment_name', label: 'Apartment Name', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'bank-analyze', name: 'Bank Account Analysis', icon: CreditCard, inputType: 'custom', description: 'Analyze your bank account number vibration',
            extraFields: [
                { name: 'account_number', label: 'Account Number', type: 'text', required: true },
                { name: 'owner_name', label: 'Account Holder', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'account_type', label: 'Account Type', type: 'select', options: [{ value: '', label: 'Select' }, { value: 'savings', label: 'Savings' }, { value: 'current', label: 'Current' }, { value: 'fixed_deposit', label: 'Fixed Deposit' }] },
                { name: 'bank_name', label: 'Bank Name', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'pin-analyze', name: 'PIN/Password Analysis', icon: Lock, inputType: 'custom', description: 'Check your PIN or password numerological strength',
            extraFields: [
                { name: 'pin_or_password', label: 'PIN / Password', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'pin_type', label: 'Type', type: 'select', options: [{ value: '', label: 'Select' }, { value: 'atm_pin', label: 'ATM PIN' }, { value: 'phone_pin', label: 'Phone PIN' }, { value: 'password', label: 'Password' }, { value: 'other', label: 'Other' }] },
            ],
        },
    ],

    relationships: [
        { slug: 'love-compatibility', name: 'Love Compatibility', icon: Heart, inputType: 'twoPerson', description: 'Analyze romantic compatibility between two people' },
        { slug: 'marriage-compatibility', name: 'Marriage Compatibility', icon: HeartHandshake, inputType: 'twoPerson', description: 'Deep marriage compatibility analysis' },
        { slug: 'wedding-date-finder', name: 'Wedding Date Finder', icon: CalendarSearch, inputType: 'twoPerson', description: 'Find the most auspicious wedding dates' },
        { slug: 'friendship-analyze', name: 'Friendship Analysis', icon: Users, inputType: 'twoPerson', description: 'Analyze friendship dynamics and compatibility' },
        { slug: 'family-harmony', name: 'Family Harmony', icon: Users, inputType: 'family', description: 'Analyze harmony between family members' },
        { slug: 'parent-child-analyze', name: 'Parent-Child Analysis', icon: UserCheck, inputType: 'custom', description: 'Understand parent-child numerological dynamics',
            extraFields: [
                { name: 'parent_name', label: 'Parent Name', type: 'text', required: true },
                { name: 'parent_birth_date', label: 'Parent Birth Date', type: 'date', required: true },
                { name: 'child_name', label: 'Child Name', type: 'text', required: true },
                { name: 'child_birth_date', label: 'Child Birth Date', type: 'date', required: true },
            ],
        },
        { slug: 'sibling-dynamics', name: 'Sibling Dynamics', icon: Users, inputType: 'custom', description: 'Analyze sibling relationship dynamics',
            extraFields: [
                { name: 'sibling1_name', label: 'Sibling 1 Name', type: 'text', required: true },
                { name: 'sibling1_birth_date', label: 'Sibling 1 Birth Date', type: 'date', required: true },
                { name: 'sibling1_birth_order', label: 'Sibling 1 Birth Order', type: 'text', required: true, placeholder: 'e.g. first, second' },
                { name: 'sibling2_name', label: 'Sibling 2 Name', type: 'text', required: true },
                { name: 'sibling2_birth_date', label: 'Sibling 2 Birth Date', type: 'date', required: true },
                { name: 'sibling2_birth_order', label: 'Sibling 2 Birth Order', type: 'text', required: true },
                { name: 'total_siblings', label: 'Total Siblings', type: 'number' },
            ],
        },
        { slug: 'inlaw-compatibility', name: 'In-Law Compatibility', icon: UserCheck, inputType: 'custom', description: 'Analyze compatibility with in-laws',
            extraFields: [
                { name: 'person_name', label: 'Your Name', type: 'text', required: true },
                { name: 'person_birth_date', label: 'Your Birth Date', type: 'date', required: true },
                { name: 'inlaw_name', label: 'In-Law Name', type: 'text', required: true },
                { name: 'inlaw_birth_date', label: 'In-Law Birth Date', type: 'date', required: true },
                { name: 'relationship_type', label: 'Relationship', type: 'select', required: true, options: [
                    { value: 'mother_in_law', label: 'Mother-in-law' }, { value: 'father_in_law', label: 'Father-in-law' },
                    { value: 'sister_in_law', label: 'Sister-in-law' }, { value: 'brother_in_law', label: 'Brother-in-law' },
                    { value: 'daughter_in_law', label: 'Daughter-in-law' }, { value: 'son_in_law', label: 'Son-in-law' },
                ] },
                { name: 'spouse_name', label: 'Spouse Name', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'divorce-risk-analyze', name: 'Divorce Risk Analysis', icon: UserX, inputType: 'twoPerson', description: 'Assess relationship risk factors numerologically' },
        { slug: 'rekindle-romance', name: 'Rekindle Romance', icon: Flame, inputType: 'twoPerson', description: 'Guidance to reignite romantic connection' },
    ],

    career: [
        { slug: 'career-path', name: 'Career Path', icon: Compass, inputType: 'base', description: 'Discover your ideal career path through numerology' },
        { slug: 'job-change-timing', name: 'Job Change Timing', icon: CalendarClock, inputType: 'custom', description: 'Find the best timing for a job change',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'search_start_date', label: 'Search Start Date', type: 'date', required: true },
                { name: 'search_end_date', label: 'Search End Date', type: 'date', required: true },
                { name: 'purpose', label: 'Purpose', type: 'text', placeholder: 'e.g. better salary, growth' },
                { name: 'target_company_name', label: 'Target Company', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'boss-compatibility', name: 'Boss Compatibility', icon: UserCheck, inputType: 'custom', description: 'Analyze compatibility with your boss',
            extraFields: [
                { name: 'employee_name', label: 'Employee Name', type: 'text', required: true },
                { name: 'employee_birth_date', label: 'Employee Birth Date', type: 'date', required: true },
                { name: 'boss_name', label: 'Boss Name', type: 'text', required: true },
                { name: 'boss_birth_date', label: 'Boss Birth Date', type: 'date', required: true },
            ],
        },
        { slug: 'team-compatibility', name: 'Team Compatibility', icon: Users, inputType: 'team', description: 'Analyze team dynamics and member compatibility' },
    ],

    timing: [
        { slug: 'daily-forecast', name: 'Daily Forecast', icon: Sun, inputType: 'base', description: 'Your personalized daily numerological forecast' },
        { slug: 'weekly-planner', name: 'Weekly Planner', icon: CalendarClock, inputType: 'base', description: 'Weekly numerological energy planner' },
        { slug: 'monthly-forecast', name: 'Monthly Forecast', icon: Moon, inputType: 'base', description: 'Monthly numerological trends and guidance' },
        { slug: 'yearly-forecast', name: 'Yearly Forecast', icon: Star, inputType: 'base', description: 'Annual numerological prediction and guidance' },
        { slug: 'best-date-finder', name: 'Best Date Finder', icon: CalendarSearch, inputType: 'custom', description: 'Find the best dates for any activity',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'activity_type', label: 'Activity Type', type: 'text', required: true, placeholder: 'e.g. wedding, travel, business launch' },
                { name: 'start_date', label: 'Start Date', type: 'date' },
                { name: 'end_date', label: 'End Date', type: 'date' },
                { name: 'partner_name', label: 'Partner Name', type: 'text', placeholder: 'Optional' },
                { name: 'partner_birth_date', label: 'Partner Birth Date', type: 'date' },
            ],
        },
        { slug: 'event-timing', name: 'Event Timing', icon: Zap, inputType: 'custom', description: 'Analyze the numerological energy of a specific event',
            extraFields: [
                { name: 'event_name', label: 'Event Name', type: 'text', required: true },
                { name: 'event_date', label: 'Event Date', type: 'date', required: true },
                { name: 'event_time', label: 'Event Time', type: 'text', placeholder: 'HH:MM' },
                { name: 'event_category', label: 'Category', type: 'select', options: [
                    { value: '', label: 'Select' }, { value: 'marriage', label: 'Marriage' }, { value: 'business_launch', label: 'Business Launch' },
                    { value: 'travel', label: 'Travel' }, { value: 'education', label: 'Education' }, { value: 'career', label: 'Career' },
                    { value: 'health', label: 'Health' }, { value: 'investment', label: 'Investment' },
                ] },
                { name: 'host_name', label: 'Host Name', type: 'text', placeholder: 'Optional' },
                { name: 'host_birth_date', label: 'Host Birth Date', type: 'date' },
            ],
        },
        { slug: 'lucky-hours', name: 'Lucky Hours', icon: Clock, inputType: 'base', description: 'Find your lucky hours for today' },
        { slug: 'transit-day', name: 'Transit Day', icon: TrendingUp, inputType: 'base', description: 'Numerological transit energy for today' },
        { slug: 'personal-cycles', name: 'Personal Cycles', icon: Activity, inputType: 'base', description: 'Understand your current personal cycle phase' },
        { slug: 'auspicious-moments', name: 'Auspicious Moments', icon: Sparkles, inputType: 'custom', description: 'Find the most auspicious moments for a purpose',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'target_date', label: 'Target Date', type: 'date', required: true },
                { name: 'purpose', label: 'Purpose', type: 'text', required: true, placeholder: 'e.g. signing a contract' },
                { name: 'start_hour', label: 'Start Hour (0-23)', type: 'number' },
                { name: 'end_hour', label: 'End Hour (0-23)', type: 'number' },
            ],
        },
    ],

    business: [
        { slug: 'name-analyze', name: 'Business Name Analysis', icon: Building2, inputType: 'custom', description: 'Analyze your business name numerologically',
            extraFields: [
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. Technology, Healthcare' },
                { name: 'founding_date', label: 'Founding Date', type: 'date' },
                { name: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Optional' },
            ],
        },
        { slug: 'name-generate', name: 'Business Name Generator', icon: Wand2, inputType: 'custom', description: 'Generate numerologically optimized business names',
            extraFields: [
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'industry', label: 'Industry', type: 'text', required: true },
                { name: 'style', label: 'Style', type: 'text', placeholder: 'e.g. modern, traditional' },
                { name: 'target_number', label: 'Target Number', type: 'number' },
            ],
        },
        { slug: 'tagline-analyze', name: 'Tagline Analysis', icon: FileText, inputType: 'custom', description: 'Analyze your business tagline vibration',
            extraFields: [
                { name: 'tagline', label: 'Tagline', type: 'text', required: true },
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'owner_name', label: 'Owner Name', type: 'text' },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date' },
                { name: 'industry', label: 'Industry', type: 'text' },
            ],
        },
        { slug: 'domain-analyze', name: 'Domain Analysis', icon: Globe, inputType: 'custom', description: 'Analyze domain name numerological energy',
            extraFields: [
                { name: 'domain_name', label: 'Domain Name', type: 'text', required: true, placeholder: 'e.g. grahvani.in' },
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date' },
                { name: 'industry', label: 'Industry', type: 'text' },
            ],
        },
        { slug: 'logo-colors', name: 'Logo Color Suggestions', icon: Palette, inputType: 'custom', description: 'Get numerologically aligned logo color suggestions',
            extraFields: [
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'industry', label: 'Industry', type: 'text' },
                { name: 'style_preference', label: 'Style Preference', type: 'text', placeholder: 'e.g. modern, elegant' },
            ],
        },
        { slug: 'logo-colors/analyze', name: 'Logo Color Analysis', icon: Palette, inputType: 'custom', description: 'Analyze existing logo colors for numerological alignment',
            extraFields: [
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'industry', label: 'Industry', type: 'text' },
            ],
        },
        { slug: 'partnership-compatibility', name: 'Partnership Compatibility', icon: HeartHandshake, inputType: 'twoPerson', description: 'Analyze business partnership compatibility' },
        { slug: 'brand-energy', name: 'Brand Energy', icon: Zap, inputType: 'custom', description: 'Measure your brand\'s numerological energy',
            extraFields: [
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'tagline', label: 'Tagline', type: 'text' },
                { name: 'primary_color', label: 'Primary Color', type: 'text', placeholder: 'e.g. blue, #3B82F6' },
                { name: 'industry', label: 'Industry', type: 'text' },
            ],
        },
        { slug: 'product-name', name: 'Product Name Analysis', icon: Package, inputType: 'custom', description: 'Analyze product name numerological energy',
            extraFields: [
                { name: 'product_name', label: 'Product Name', type: 'text', required: true },
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'product_category', label: 'Category', type: 'text' },
                { name: 'target_audience', label: 'Target Audience', type: 'text' },
            ],
        },
        { slug: 'store-location', name: 'Store Location Analysis', icon: Home, inputType: 'custom', description: 'Analyze a store location number for business success',
            extraFields: [
                { name: 'address_number', label: 'Address Number', type: 'text', required: true },
                { name: 'business_name', label: 'Business Name', type: 'text', required: true },
                { name: 'business_type', label: 'Business Type', type: 'text' },
                { name: 'floor_number', label: 'Floor Number', type: 'number' },
                { name: 'facing_direction', label: 'Facing Direction', type: 'select', options: [
                    { value: '', label: 'Select' }, { value: 'north', label: 'North' }, { value: 'south', label: 'South' },
                    { value: 'east', label: 'East' }, { value: 'west', label: 'West' },
                    { value: 'northeast', label: 'Northeast' }, { value: 'northwest', label: 'Northwest' },
                    { value: 'southeast', label: 'Southeast' }, { value: 'southwest', label: 'Southwest' },
                ] },
            ],
        },
        { slug: 'card-analyze', name: 'Business Card Analysis', icon: CreditCard, inputType: 'custom', description: 'Analyze business card elements numerologically',
            extraFields: [
                { name: 'person_name', label: 'Name on Card', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'mobile_number', label: 'Mobile Number', type: 'text', required: true },
                { name: 'email_address', label: 'Email Address', type: 'text', required: true },
                { name: 'business_name', label: 'Business Name', type: 'text' },
                { name: 'job_title', label: 'Job Title', type: 'text' },
                { name: 'industry', label: 'Industry', type: 'text' },
            ],
        },
        { slug: 'email-generate', name: 'Email ID Generator', icon: Target, inputType: 'custom', description: 'Generate numerologically optimized email addresses',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'domain', label: 'Domain', type: 'text', required: true, placeholder: 'e.g. gmail.com' },
                { name: 'purpose', label: 'Purpose', type: 'text', placeholder: 'e.g. business, personal' },
            ],
        },
    ],

    spiritual: [
        { slug: 'karmic-debt', name: 'Karmic Debt', icon: Shield, inputType: 'base', description: 'Discover your karmic debt numbers and their meaning' },
        { slug: 'life-lessons', name: 'Life Lessons', icon: Lightbulb, inputType: 'base', description: 'Understand your soul\'s life lessons from numerology' },
        { slug: 'spiritual-guide', name: 'Spiritual Guide', icon: Compass, inputType: 'base', description: 'Numerological guide for spiritual development' },
        { slug: 'meditation', name: 'Meditation Guide', icon: Sparkles, inputType: 'base', description: 'Personalized meditation recommendations' },
        { slug: 'chakra-alignment', name: 'Chakra Alignment', icon: Layers, inputType: 'base', description: 'Map your numerological profile to chakra energies' },
        { slug: 'past-life', name: 'Past Life Insights', icon: Moon, inputType: 'base', description: 'Past life karmic patterns through numerology' },
    ],

    packages: [
        { slug: 'life-blueprint', name: 'Life Blueprint', icon: LayoutGrid, inputType: 'base', description: 'Comprehensive life analysis package' },
        { slug: 'new-parent', name: 'New Parent Package', icon: Baby, inputType: 'custom', description: 'Complete numerological guide for new parents',
            extraFields: [
                { name: 'parent1_name', label: 'Parent 1 Name', type: 'text', required: true },
                { name: 'parent1_birth_date', label: 'Parent 1 Birth Date', type: 'date', required: true },
                { name: 'baby_birth_date', label: 'Baby Birth Date', type: 'date', required: true },
                { name: 'parent2_name', label: 'Parent 2 Name', type: 'text' },
                { name: 'parent2_birth_date', label: 'Parent 2 Birth Date', type: 'date' },
                { name: 'baby_gender', label: 'Baby Gender', type: 'select', options: [{ value: '', label: 'Select' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
            ],
        },
        { slug: 'entrepreneur', name: 'Entrepreneur Package', icon: Briefcase, inputType: 'custom', description: 'Complete business numerology for entrepreneurs',
            extraFields: [
                { name: 'founder_name', label: 'Founder Name', type: 'text', required: true },
                { name: 'founder_birth_date', label: 'Founder Birth Date', type: 'date', required: true },
                { name: 'business_idea', label: 'Business Idea', type: 'text' },
                { name: 'proposed_business_name', label: 'Proposed Business Name', type: 'text' },
                { name: 'planned_launch_date', label: 'Planned Launch Date', type: 'date' },
                { name: 'co_founder_name', label: 'Co-founder Name', type: 'text' },
                { name: 'co_founder_birth_date', label: 'Co-founder Birth Date', type: 'date' },
            ],
        },
        { slug: 'marriage', name: 'Marriage Package', icon: Heart, inputType: 'twoPerson', description: 'Complete marriage numerology analysis' },
        { slug: 'career-transformation', name: 'Career Transformation', icon: TrendingUp, inputType: 'custom', description: 'Complete career change numerological guidance',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'current_role', label: 'Current Role', type: 'text' },
                { name: 'target_industry', label: 'Target Industry', type: 'text' },
                { name: 'boss_name', label: 'Boss Name', type: 'text' },
                { name: 'boss_birth_date', label: 'Boss Birth Date', type: 'date' },
            ],
        },
        { slug: 'wealth-mastery', name: 'Wealth Mastery', icon: Wallet, inputType: 'base', description: 'Numerological wealth and abundance analysis' },
        { slug: 'family-harmony', name: 'Family Harmony Package', icon: Users, inputType: 'family', description: 'Complete family harmony analysis package' },
        { slug: 'health-wellness', name: 'Health & Wellness', icon: Activity, inputType: 'base', description: 'Health insights through numerology' },
        { slug: 'student-success', name: 'Student Success', icon: GraduationCap, inputType: 'custom', description: 'Academic success through numerology',
            extraFields: [
                { name: 'student_name', label: 'Student Name', type: 'text', required: true },
                { name: 'student_birth_date', label: 'Student Birth Date', type: 'date', required: true },
                { name: 'current_grade', label: 'Current Grade', type: 'text' },
                { name: 'parent_name', label: 'Parent Name', type: 'text' },
                { name: 'parent_birth_date', label: 'Parent Birth Date', type: 'date' },
            ],
        },
        { slug: 'real-estate', name: 'Real Estate', icon: Home, inputType: 'custom', description: 'Property purchase numerological analysis',
            extraFields: [
                { name: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
                { name: 'buyer_birth_date', label: 'Buyer Birth Date', type: 'date', required: true },
                { name: 'property_house_number', label: 'Property Number', type: 'text' },
                { name: 'property_address', label: 'Property Address', type: 'text' },
                { name: 'planned_purchase_date', label: 'Planned Purchase Date', type: 'date' },
                { name: 'property_type', label: 'Property Type', type: 'select', options: [
                    { value: '', label: 'Select' }, { value: 'apartment', label: 'Apartment' },
                    { value: 'house', label: 'House' }, { value: 'villa', label: 'Villa' },
                    { value: 'plot', label: 'Plot' }, { value: 'commercial', label: 'Commercial' },
                ] },
            ],
        },
        { slug: 'annual-fortune', name: 'Annual Fortune', icon: Star, inputType: 'custom', description: 'Complete annual fortune and lucky calendar',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'year', label: 'Year', type: 'number', placeholder: String(new Date().getFullYear()) },
                { name: 'include_monthly_breakdown', label: 'Monthly Breakdown', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
            ],
        },
    ],

    unique: [
        { slug: 'lucky-numbers', name: 'Lucky Numbers', icon: Star, inputType: 'base', description: 'Discover your personal lucky numbers' },
        { slug: 'signature-analyze', name: 'Signature Analysis', icon: FileText, inputType: 'custom', description: 'Analyze your signature numerologically',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'current_signature', label: 'Current Signature Text', type: 'text', required: true },
                { name: 'signature_purpose', label: 'Purpose', type: 'text', placeholder: 'e.g. official, personal' },
            ],
        },
        { slug: 'email-analyze', name: 'Email Analysis', icon: Target, inputType: 'custom', description: 'Analyze your email address numerologically',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'email_address', label: 'Email Address', type: 'text', required: true },
                { name: 'email_purpose', label: 'Purpose', type: 'text', placeholder: 'e.g. professional, personal' },
            ],
        },
        { slug: 'social-media-analyze', name: 'Social Media Analysis', icon: Globe, inputType: 'custom', description: 'Analyze your social media handle',
            extraFields: [
                { name: 'full_name', label: 'Full Name', type: 'text', required: true },
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'social_handle', label: 'Social Handle', type: 'text', required: true, placeholder: '@yourhandle' },
                { name: 'platform', label: 'Platform', type: 'select', options: [
                    { value: '', label: 'Select' }, { value: 'instagram', label: 'Instagram' }, { value: 'twitter', label: 'Twitter/X' },
                    { value: 'linkedin', label: 'LinkedIn' }, { value: 'youtube', label: 'YouTube' }, { value: 'tiktok', label: 'TikTok' },
                ] },
            ],
        },
        { slug: 'password-optimize', name: 'Password Optimizer', icon: Lock, inputType: 'base', description: 'Get numerologically optimized password guidelines' },
        { slug: 'license-plate-find', name: 'License Plate Finder', icon: Car, inputType: 'custom', description: 'Find lucky license plate numbers',
            extraFields: [
                { name: 'owner_name', label: 'Owner Name', type: 'text', required: true },
                { name: 'owner_birth_date', label: 'Owner Birth Date', type: 'date', required: true },
                { name: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: [
                    { value: '', label: 'Select' }, { value: 'car', label: 'Car' }, { value: 'bike', label: 'Bike' }, { value: 'truck', label: 'Truck' },
                ] },
                { name: 'state_code', label: 'State Code', type: 'text', placeholder: 'e.g. KA, MH, DL' },
            ],
        },
        { slug: 'lucky-colors', name: 'Lucky Colors', icon: Palette, inputType: 'base', description: 'Discover your personal lucky colors' },
        { slug: 'compatibility-batch', name: 'Batch Compatibility', icon: Users, inputType: 'custom', description: 'Compare compatibility with multiple people at once',
            extraFields: [
                { name: 'primary_person_name', label: 'Your Name', type: 'text', required: true },
                { name: 'primary_person_birth_date', label: 'Your Birth Date', type: 'date', required: true },
            ],
        },
    ],

    daily: [
        { slug: 'lucky-color', name: 'Daily Lucky Color', icon: Palette, inputType: 'custom', description: 'Your lucky color for today',
            extraFields: [
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'full_name', label: 'Full Name', type: 'text' },
            ],
        },
        { slug: 'energy-forecast', name: 'Energy Forecast', icon: Zap, inputType: 'custom', description: 'Your energy forecast for today',
            extraFields: [
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'full_name', label: 'Full Name', type: 'text' },
            ],
        },
        { slug: 'emotional-balance', name: 'Emotional Balance', icon: Activity, inputType: 'custom', description: 'Your emotional balance reading for today',
            extraFields: [
                { name: 'birth_date', label: 'Birth Date', type: 'date', required: true },
                { name: 'full_name', label: 'Full Name', type: 'text' },
            ],
        },
    ],
};

// =============================================================================
// RAW CALCULATOR CATEGORIES
// =============================================================================

export interface RawCalculatorMeta {
    slug: string;
    name: string;
    description: string;
    category: string;
}

export interface RawCalculatorCategoryMeta {
    key: string;
    name: string;
    icon: LucideIcon;
    slugs: string[];
}

export const RAW_CALCULATOR_CATEGORIES: RawCalculatorCategoryMeta[] = [
    { key: 'core', name: 'Core', icon: Hash, slugs: ['destiny', 'birth-number', 'birth-path', 'maturity', 'personal-year', 'personal-month', 'personal-day', 'life-cycles', 'karmic-lesson', 'balance', 'subconscious-self'] },
    { key: 'compatibility', name: 'Compatibility', icon: Heart, slugs: ['birth-path-compatibility', 'compatibility', 'romantic-compatibility', 'business-partnership', 'family-dynamics', 'friendship-compatibility', 'group-dynamics', 'romantic-synergy', 'medical-compatibility', 'family-harmony-analyzer', 'friendship-resonance'] },
    { key: 'advanced', name: 'Advanced Core', icon: Gem, slugs: ['pinnacle', 'favorable-periods', 'pyramid-fortune', 'mystic-cross', 'hour-of-birth'] },
    { key: 'predictive', name: 'Predictive', icon: TrendingUp, slugs: ['daily-prediction', 'event-timing', 'fatalistic-predictor'] },
    { key: 'sound', name: 'Sound & Vibration', icon: Music, slugs: ['syllable-analyzer', 'sound-vibration', 'name-rhythm-analyzer', 'sound-frequency-analyzer'] },
    { key: 'color', name: 'Color, Geometry, Crystal', icon: Palette, slugs: ['color-vibration-mapper', 'sacred-geometry-vibration', 'crystal-resonance'] },
    { key: 'business-financial', name: 'Business & Financial', icon: Wallet, slugs: ['business-numerology', 'financial-prediction', 'stock-market-timer'] },
    { key: 'prediction-systems', name: 'Prediction Systems', icon: Compass, slugs: ['life-path-prediction', 'karmic-debt-analyzer', 'predictive-name-analysis'] },
    { key: 'health', name: 'Health', icon: Activity, slugs: ['health-analyzer', 'dietary-numerology', 'healing-remedies'] },
    { key: 'property', name: 'Property', icon: Home, slugs: ['property-analyzer', 'land-vibration', 'house-number-harmonizer', 'location-prosperity'] },
    { key: 'time-planetary', name: 'Time & Planetary', icon: Clock, slugs: ['planetary-hours', 'time-cycles-analyzer', 'activity-timing-optimizer', 'personal-rhythms'] },
    { key: 'travel', name: 'Travel', icon: Plane, slugs: ['travel-timing-analyzer', 'destination-compatibility', 'migration-success-predictor', 'vehicle-number-analyzer'] },
    { key: 'career', name: 'Career', icon: Briefcase, slugs: ['career-path', 'professional-timing-optimizer', 'business-name-analyzer', 'interview-success-predictor'] },
    { key: 'education', name: 'Education', icon: GraduationCap, slugs: ['learning-style', 'subject-compatibility', 'exam-timing-optimizer', 'teacher-student-compatibility'] },
    { key: 'legal', name: 'Legal', icon: Scale, slugs: ['legal-case-timing', 'contract-analysis', 'legal-compatibility', 'justice-outcome-predictor'] },
    { key: 'spiritual', name: 'Spiritual', icon: Sparkles, slugs: ['spiritual-path', 'karmic-lesson-analyzer', 'soul-purpose-revealer', 'meditation-timing-optimizer'] },
    { key: 'financial-planning', name: 'Financial Planning', icon: TrendingUp, slugs: ['wealth-potential', 'investment-timing-optimizer', 'debt-liberation', 'business-success-predictor'] },
    { key: 'relationship', name: 'Relationship Counseling', icon: HeartHandshake, slugs: ['professional-relationship-optimizer'] },
    { key: 'name-optimization', name: 'Name Optimization', icon: Wand2, slugs: ['name-harmonizer', 'business-name-optimizer', 'baby-name-selector', 'name-change-analyzer'] },
    { key: 'life-planning', name: 'Life Planning', icon: LayoutGrid, slugs: ['life-blueprint', 'major-decision-timer', 'life-transition-navigator', 'personal-evolution-tracker'] },
    { key: 'grids', name: 'Grid Systems', icon: LayoutGrid, slugs: ['name-grid', 'birth-date-grid', 'karmic-pattern-grid', 'number-balance-grid', 'grid-visualizer'] },
];

/** Flat list of all raw calculators with display metadata */
export const RAW_CALCULATORS: RawCalculatorMeta[] = RAW_CALCULATOR_CATEGORIES.flatMap(cat =>
    cat.slugs.map(slug => ({
        slug,
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `Chaldean ${cat.name.toLowerCase()} calculator`,
        category: cat.key,
    }))
);
