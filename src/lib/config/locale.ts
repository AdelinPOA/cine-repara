/**
 * Locale Configuration
 * Central configuration for Romanian localization
 */

export const LOCALE_CONFIG = {
  // Locale identifier
  locale: 'ro-RO',
  language: 'ro',
  country: 'RO',

  // Currency
  currency: 'RON',
  currencySymbol: 'RON',

  // Date & Time
  timezone: 'Europe/Bucharest',
  dateFormat: 'DD.MM.YYYY',
  dateTimeFormat: 'DD.MM.YYYY HH:mm',
  timeFormat: 'HH:mm',

  // Number formatting
  decimalSeparator: ',',
  thousandsSeparator: '.',
} as const;

/**
 * Common Romanian translations for UI elements
 */
export const TRANSLATIONS = {
  common: {
    loading: 'Se încarcă...',
    error: 'Eroare',
    success: 'Succes',
    cancel: 'Anulează',
    save: 'Salvează',
    delete: 'Șterge',
    edit: 'Modifică',
    search: 'Caută',
    filter: 'Filtrează',
    sort: 'Sortează',
    reset: 'Resetează',
    back: 'Înapoi',
    next: 'Următor',
    previous: 'Anterior',
    close: 'Închide',
    confirm: 'Confirmă',
    view: 'Vezi',
    viewMore: 'Vezi mai mult',
    viewLess: 'Vezi mai puțin',
  },

  auth: {
    login: 'Conectare',
    logout: 'Deconectare',
    register: 'Înregistrare',
    email: 'Email',
    password: 'Parolă',
    forgotPassword: 'Ai uitat parola?',
    rememberMe: 'Ține-mă minte',
    alreadyHaveAccount: 'Ai deja cont?',
    dontHaveAccount: 'Nu ai cont?',
  },

  user: {
    profile: 'Profil',
    settings: 'Setări',
    dashboard: 'Tablou de bord',
    myAccount: 'Contul meu',
  },

  installer: {
    installer: 'Instalator',
    installers: 'Instalatori',
    findInstallers: 'Găsește instalatori',
    viewProfile: 'Vezi profil',
    contactInstaller: 'Contactează instalatorul',
    verified: 'Verificat',
    available: 'Disponibil',
    unavailable: 'Indisponibil',
    yearsExperience: 'ani de experiență',
    servicesOffered: 'Servicii oferite',
    serviceAreas: 'Zone de acoperire',
    hourlyRate: 'Tarif orar',
  },

  review: {
    review: 'Recenzie',
    reviews: 'Recenzii',
    writeReview: 'Scrie o recenzie',
    rating: 'Rating',
    title: 'Titlu',
    comment: 'Comentariu',
    submitReview: 'Trimite recenzia',
    helpful: 'Util',
    notHelpful: 'Nu este util',
    verified: 'Verificat',
    workCompletedAt: 'Lucrare finalizată',
    noReviews: 'Nu există recenzii',
    averageRating: 'Rating mediu',
    ratingDistribution: 'Distribuția rating-urilor',
  },

  search: {
    search: 'Caută',
    searchPlaceholder: 'Caută instalator...',
    whatService: 'Ce serviciu cauți?',
    whereLocation: 'În ce județ?',
    allServices: 'Toate serviciile',
    allRegions: 'Toate județele',
    allCities: 'Toate orașele',
    filters: 'Filtre',
    sortBy: 'Sortează după',
    noResults: 'Niciun rezultat găsit',
    results: 'rezultate',
  },

  pagination: {
    page: 'Pagina',
    of: 'din',
    showing: 'Afișare',
    to: 'până la',
    results: 'rezultate',
    previous: 'Anterior',
    next: 'Următor',
  },

  time: {
    now: 'acum',
    today: 'azi',
    yesterday: 'ieri',
    tomorrow: 'mâine',
    lastWeek: 'săptămâna trecută',
    lastMonth: 'luna trecută',
    lastYear: 'anul trecut',
  },

  error: {
    notFound: 'Nu a fost găsit',
    serverError: 'Eroare de server',
    unauthorized: 'Neautorizat',
    forbidden: 'Interzis',
    badRequest: 'Cerere invalidă',
    tryAgain: 'Încearcă din nou',
    somethingWentWrong: 'Ceva nu a mers bine',
  },
} as const;

/**
 * Romanian month names
 */
export const MONTH_NAMES = {
  full: [
    'ianuarie',
    'februarie',
    'martie',
    'aprilie',
    'mai',
    'iunie',
    'iulie',
    'august',
    'septembrie',
    'octombrie',
    'noiembrie',
    'decembrie',
  ],
  short: [
    'ian',
    'feb',
    'mar',
    'apr',
    'mai',
    'iun',
    'iul',
    'aug',
    'sep',
    'oct',
    'noi',
    'dec',
  ],
} as const;

/**
 * Romanian day names
 */
export const DAY_NAMES = {
  full: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
  short: ['dum', 'lun', 'mar', 'mie', 'joi', 'vin', 'sâm'],
} as const;
