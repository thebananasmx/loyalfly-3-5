export const COUNTRIES = [
  { code: 'MX', dialCode: '+52', name: 'México', digits: 10 },
  { code: 'HN', dialCode: '+504', name: 'Honduras', digits: 8 },
  { code: 'US', dialCode: '+1', name: 'Estados Unidos', digits: 10 },
  { code: 'CO', dialCode: '+57', name: 'Colombia', digits: 10 },
  { code: 'AR', dialCode: '+54', name: 'Argentina', digits: 10 },
  { code: 'CL', dialCode: '+56', name: 'Chile', digits: 9 },
  { code: 'PE', dialCode: '+51', name: 'Perú', digits: 9 },
  { code: 'ES', dialCode: '+34', name: 'España', digits: 9 },
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
