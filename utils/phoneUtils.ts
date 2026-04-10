export const COUNTRIES = [
  { code: 'MX', dialCode: '+52', name: 'México', digits: 10, emoji: '🇲🇽' },
  { code: 'US', dialCode: '+1', name: 'Estados Unidos', digits: 10, emoji: '🇺🇸' },
  { code: 'CA', dialCode: '+1', name: 'Canadá', digits: 10, emoji: '🇨🇦' },
  { code: 'AR', dialCode: '+54', name: 'Argentina', digits: 10, emoji: '🇦🇷' },
  { code: 'BO', dialCode: '+591', name: 'Bolivia', digits: 8, emoji: '🇧🇴' },
  { code: 'BR', dialCode: '+55', name: 'Brasil', digits: 11, emoji: '🇧🇷' },
  { code: 'CL', dialCode: '+56', name: 'Chile', digits: 9, emoji: '🇨🇱' },
  { code: 'CO', dialCode: '+57', name: 'Colombia', digits: 10, emoji: '🇨🇴' },
  { code: 'CR', dialCode: '+506', name: 'Costa Rica', digits: 8, emoji: '🇨🇷' },
  { code: 'CU', dialCode: '+53', name: 'Cuba', digits: 8, emoji: '🇨🇺' },
  { code: 'DO', dialCode: '+1', name: 'República Dominicana', digits: 10, emoji: '🇩🇴' },
  { code: 'EC', dialCode: '+593', name: 'Ecuador', digits: 9, emoji: '🇪🇨' },
  { code: 'SV', dialCode: '+503', name: 'El Salvador', digits: 8, emoji: '🇸🇻' },
  { code: 'GT', dialCode: '+502', name: 'Guatemala', digits: 8, emoji: '🇬🇹' },
  { code: 'HN', dialCode: '+504', name: 'Honduras', digits: 8, emoji: '🇭🇳' },
  { code: 'NI', dialCode: '+505', name: 'Nicaragua', digits: 8, emoji: '🇳🇮' },
  { code: 'PA', dialCode: '+507', name: 'Panamá', digits: 8, emoji: '🇵🇦' },
  { code: 'PY', dialCode: '+595', name: 'Paraguay', digits: 9, emoji: '🇵🇾' },
  { code: 'PE', dialCode: '+51', name: 'Perú', digits: 9, emoji: '🇵🇪' },
  { code: 'PR', dialCode: '+1', name: 'Puerto Rico', digits: 10, emoji: '🇵🇷' },
  { code: 'UY', dialCode: '+598', name: 'Uruguay', digits: 8, emoji: '🇺🇾' },
  { code: 'VE', dialCode: '+58', name: 'Venezuela', digits: 10, emoji: '🇻🇪' },
  { code: 'ES', dialCode: '+34', name: 'España', digits: 9, emoji: '🇪🇸' },
];

export const validatePhoneNumber = (phone: string, countryCode: string): string => {
    if (!phone) return "El número de teléfono es requerido."; 
    let cleaned = phone.replace(/\D/g, '');
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (!country) return "País no soportado.";

    return cleaned.length === country.digits 
        ? "" 
        : `Ingresa un número válido de ${country.digits} dígitos.`;
};

export const formatPhoneWithDialCode = (phone: string, countryCode: string): string => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    const cleaned = phone.replace(/\D/g, '');
    return country ? `${country.dialCode}${cleaned}` : cleaned;
};

export const parsePhoneNumber = (phone: string) => {
    if (!phone) return { countryCode: 'MX', number: '' };
    for (const country of COUNTRIES) {
        if (phone.startsWith(country.dialCode)) {
            return { countryCode: country.code, number: phone.substring(country.dialCode.length) };
        }
    }
    return { countryCode: 'MX', number: phone };
};
