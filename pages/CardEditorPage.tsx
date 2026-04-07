import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { useAuth } from '../context/AuthContext';
import { updateCardSettings, getBusinessData, uploadCustomStamp } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import type { Business } from '../types';
import QRCode from 'qrcode';
import { 
  StarIcon, 
  CoffeeIcon, 
  HeartIcon, 
  ScissorsIcon, 
  GiftIcon 
} from '../components/StampIcons';

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CheckIconSuccess = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00AA00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const QRIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <g id="Layer_2" data-name="Layer 2">
      <g id="Health_Icons" data-name="Health Icons">
        <g>
          <path d="M4,22H22V4H4ZM8,8H18V18H8Z"/>
          <path d="M4,44H22V26H4ZM8,30H18V40H8Z"/>
          <path d="M26,4V22H44V4ZM40,18H30V8H40Z"/>
          <rect x="11" y="11" width="4" height="4"/>
          <polygon points="30 33 26 33 26 44 44 44 44 40 30 40 30 33"/>
          <polygon points="40 33 33 33 33 37 44 37 44 26 40 26 40 33"/>
          <rect x="26" y="26" width="11" height="4"/>
        </g>
      </g>
    </g>
  </svg>
);
const LockIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4"} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;
const UploadIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

const CardEditorPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [rewardText, setRewardText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cardColor, setCardColor] = useState('#FEF3C7');
  const [textColorScheme, setTextColorScheme] = useState<'dark' | 'light'>('dark');
  const [stampsGoal, setStampsGoal] = useState(10);
  const [stampIconType, setStampIconType] = useState<'star' | 'coffee' | 'heart' | 'scissors' | 'gift' | 'custom'>('star');
  const [stampColor, setStampColor] = useState('#FFC700');
  const [customStampUrl, setCustomStampUrl] = useState('');
  const [sampleStamps, setSampleStamps] = useState(4);
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
        setShowQrPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
      document.title = 'Editor de Tarjeta | Loyalfly App';
      const fetchInitialData = async () => {
          if (!user) return;
          setIsLoadingData(true);
          try {
              const data = await getBusinessData(user.uid);
              if (data) {
                  setBusinessData(data);
                  setSlug(data.slug || '');
                  if (data.cardSettings) {
                      setBusinessName(data.cardSettings.name || data.name || '');
                      setRewardText(data.cardSettings.reward || '');
                      setCardColor(data.cardSettings.color || '#FEF3C7');
                      setTextColorScheme(data.cardSettings.textColorScheme || 'dark');
                      setLogoUrl(data.cardSettings.logoUrl || '');
                      setStampsGoal(data.cardSettings.stampsGoal || 10);
                      setStampIconType(data.cardSettings.stampIconType || 'star');
                      setStampColor(data.cardSettings.stampColor || '#FFC700');
                      setCustomStampUrl(data.cardSettings.customStampUrl || '');
                  } else {
                      setBusinessName(data.name || '');
                  }
              }
          } catch (error) {
              console.error("Failed to fetch business data", error);
              showToast(t('cardEditor.loadError'), 'error');
          } finally {
              setIsLoadingData(false);
          }
      };

      fetchInitialData();
  }, [user, showToast, t]);

  const publicCardUrl = slug ? `${window.location.origin}/view/${slug}` : '';
  const isFreePlan = businessData?.plan === 'Gratis';

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateCardSettings(user.uid, {
            name: businessName,
            reward: rewardText,
            color: cardColor,
            textColorScheme: textColorScheme,
            logoUrl: logoUrl,
            stampsGoal: stampsGoal,
            stampIconType: stampIconType,
            stampColor: stampColor,
            customStampUrl: customStampUrl
        });
        showToast(t('cardEditor.saveSuccess'), 'success');
    } catch (error) {
        console.error("Failed to save settings", error);
        showToast(t('cardEditor.saveError'), 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicCardUrl).then(() => {
        setCopied(true);
        showToast(t('card.copied'), 'success');
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQr = async () => {
    if (!publicCardUrl) return;
    try {
      const dataUrl = await QRCode.toDataURL(publicCardUrl, {
        width: 2000,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qr-${slug || 'business'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('QR descargado con éxito', 'success');
    } catch (err) {
      console.error('Error generating QR:', err);
      showToast('Error al generar el QR', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 500KB to stay within Firestore document limits comfortably
    if (file.size > 500 * 1024) {
      showToast(t('card.fileSizeError'), 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCustomStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 300 * 1024) {
      showToast(t('card.fileSizeError'), 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomStampUrl(reader.result as string);
      setStampIconType('custom');
    };
    reader.readAsDataURL(file);
  };

  const [previewMode, setPreviewMode] = useState<'web' | 'apple' | 'google'>('web');

  if (isLoadingData) {
      return (
          <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                <span className="sr-only">{t('common.loading')}</span>
              </div>
          </div>
      );
  }

  // Mock data for preview
  const mockCustomer = {
    name: 'John Doe',
    phone: '+52 55 1234 5678',
    id: 'JD12345678'
  };

  const renderAppleWallet = () => {
    const isLight = textColorScheme === 'light';
    const primaryTextColor = isLight ? 'text-white' : 'text-black';
    const secondaryTextColor = isLight ? 'text-white/70' : 'text-gray-500';
    
    return (
      <div className="w-full max-w-[320px] mx-auto rounded-[20px] overflow-hidden shadow-2xl flex flex-col font-sans" style={{ backgroundColor: cardColor }}>
        {/* Apple Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-xs">L</span>}
            </div>
            <span className={`text-[10px] font-bold tracking-widest uppercase truncate max-w-[120px] ${isLight ? 'text-white/80' : 'text-black/60'}`}>
              {businessName || 'LOYALFLY'}
            </span>
          </div>
        </div>

        {/* Apple Strip Image (Stamps) */}
        <div className="px-4 py-2">
          <div className="grid grid-cols-5 gap-2 p-3 rounded-xl">
            {Array.from({ length: stampsGoal }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-full flex items-center justify-center ${i < sampleStamps ? (isLight ? 'bg-white' : 'bg-black') : 'bg-white/20'}`}>
                {i < sampleStamps && (
                  <div className="w-full h-full p-1 flex items-center justify-center">
                    {stampIconType === 'star' && <StarIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'coffee' && <CoffeeIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'heart' && <HeartIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'scissors' && <ScissorsIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'gift' && <GiftIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'custom' && customStampUrl && <img src={customStampUrl} alt="stamp" className="w-full h-full object-contain" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Apple Fields */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex flex-col min-w-0 flex-[1.5]">
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${isLight ? 'text-white/60' : 'text-black/40'}`}>CLIENTE</span>
              <span className={`text-xs font-semibold truncate ${primaryTextColor}`}>{mockCustomer.name}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-shrink-0 text-center">
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${isLight ? 'text-white/60' : 'text-black/40'}`}>SELLOS</span>
              <span className={`text-xs font-semibold ${primaryTextColor}`}>{sampleStamps}/{stampsGoal}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-[1.5] text-right">
              <span className={`text-[9px] font-bold uppercase tracking-tighter ${isLight ? 'text-white/60' : 'text-black/40'}`}>RECOMPENSA</span>
              <span className={`text-xs font-semibold truncate ${primaryTextColor}`}>{rewardText || 'Premio'}</span>
            </div>
          </div>
        </div>

        {/* Apple QR */}
        <div className="p-6 flex flex-col items-center gap-2 mt-auto">
          <div className="bg-white p-2 rounded-lg shadow-sm">
             <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockCustomer.id}`} 
                alt="QR" 
                className="w-28 h-28"
              />
          </div>
          <span className={`text-[10px] font-medium tracking-wide ${isLight ? 'text-white/60' : 'text-black/40'}`}>Escanea, suma sellos</span>
        </div>
      </div>
    );
  };

  const renderGoogleWallet = () => {
    const isLight = textColorScheme === 'light';
    const primaryTextColor = isLight ? 'text-white' : 'text-black';
    const secondaryTextColor = isLight ? 'text-white/70' : 'text-gray-500';

    return (
      <div className="w-full max-w-[320px] mx-auto rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans border border-black/5" style={{ backgroundColor: cardColor }}>
        {/* Google Header */}
        <div className="p-4 flex items-center gap-3 border-b border-black/5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/10">
            {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-cover" /> : <span className={`${primaryTextColor} font-bold text-sm`}>L</span>}
          </div>
          <span className={`text-base font-medium truncate ${primaryTextColor}`}>
            {businessName || 'Loyalfly'}
          </span>
        </div>

        {/* Google Hero Image (Stamps) */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2 p-3 rounded-lg">
            {Array.from({ length: stampsGoal }).map((_, i) => (
              <div key={i} className={`aspect-square rounded-full flex items-center justify-center ${i < sampleStamps ? (isLight ? 'bg-white' : 'bg-black') : 'bg-white/20'}`}>
                {i < sampleStamps && (
                  <div className="w-full h-full p-1 flex items-center justify-center">
                    {stampIconType === 'star' && <StarIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'coffee' && <CoffeeIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'heart' && <HeartIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'scissors' && <ScissorsIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'gift' && <GiftIcon className="w-full h-full" style={{ color: stampColor }} />}
                    {stampIconType === 'custom' && customStampUrl && <img src={customStampUrl} alt="stamp" className="w-full h-full object-contain" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Google Info */}
        <div className="p-5 space-y-4">
           <div className="flex flex-col">
              <span className={`text-sm font-medium ${primaryTextColor}`}>{mockCustomer.name}</span>
              <span className={`text-xs ${isLight ? 'text-white/60' : 'text-gray-500'}`}>Miembro desde hoy</span>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className={`block text-xs mb-1 ${isLight ? 'text-white/60' : 'text-gray-500'}`}>Sellos acumulados</span>
                <span className={`text-lg font-bold ${primaryTextColor}`}>{sampleStamps}</span>
              </div>
              <div>
                <span className={`block text-xs mb-1 ${isLight ? 'text-white/60' : 'text-gray-500'}`}>Recompensas</span>
                <span className={`text-lg font-bold ${primaryTextColor}`}>0</span>
              </div>
           </div>
        </div>

        {/* Google QR */}
        <div className="p-6 flex flex-col items-center border-t border-black/5 mt-auto">
          <div className="bg-white p-2 rounded-lg shadow-sm">
             <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${mockCustomer.id}`} 
                alt="QR" 
                className="w-32 h-32"
              />
          </div>
          <span className={`mt-2 text-sm font-mono tracking-widest ${isLight ? 'text-white/80' : 'text-gray-600'}`}>{mockCustomer.id.substring(0, 8)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Editor Controls */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                title={t('common.backToDashboard')}
            >
                <ArrowLeftIcon />
            </Link>
            <h1 className="text-3xl font-bold text-black tracking-tight">{t('card.editorTitle')}</h1>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
          <div>
            <label htmlFor="businessName" className="block text-base font-medium text-gray-700 mb-1">
              {t('card.businessNameLabel')}
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>

          {/* Logo Section */}
          <div className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              Logo
            </label>
            
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-300">L</span>
                  )}
               </div>
               <div className="flex flex-wrap gap-2">
                  <button
                    onClick={triggerFileUpload}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <UploadIcon />
                    {t('card.logoUploadLabel')}
                  </button>
                  {logoUrl && (
                    <button
                      onClick={removeLogo}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <TrashIcon />
                      {t('card.logoRemove')}
                    </button>
                  )}
               </div>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                />
            </div>

            <div>
              <label htmlFor="logoUrl" className="block text-xs font-medium text-gray-500 mb-1">
                {t('card.logoUrlLabel')}
              </label>
              <input
                id="logoUrl"
                type="url"
                value={logoUrl.startsWith('data:') ? '' : logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
          </div>

          <div>
            <label htmlFor="rewardText" className="block text-base font-medium text-gray-700 mb-1">
              {t('card.rewardTextLabel')}
            </label>
            <input
              id="rewardText"
              type="text"
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>

          {/* Stamps Goal Section */}
          <div>
            <label htmlFor="stampsGoal" className="flex items-center gap-2 text-base font-medium text-gray-700 mb-1">
              Objetivo de Sellos
              {isFreePlan && <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"><LockIcon /> Premium</span>}
            </label>
            <div className="relative mt-1">
                <input
                    id="stampsGoal"
                    type="number"
                    min="1"
                    value={stampsGoal}
                    onChange={(e) => setStampsGoal(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={isFreePlan}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-colors ${
                        isFreePlan 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 focus:ring-black focus:border-black'
                    }`}
                />
            </div>
            {isFreePlan && <p className="mt-1.5 text-xs text-gray-500">Suscríbete al Plan Entrepreneur para personalizar el número de sellos.</p>}
          </div>

          <div>
            <label htmlFor="cardColorHex" className="block text-base font-medium text-gray-700 mb-1">
                {t('card.cardColorLabel')}
            </label>
            <div className="mt-1 flex items-center gap-3">
                <div className="relative w-12 h-10">
                    <div 
                        className="w-full h-full rounded-md border border-gray-300"
                        style={{ backgroundColor: cardColor }}
                    ></div>
                    <input
                        type="color"
                        value={cardColor}
                        onChange={(e) => setCardColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Seleccionar un color"
                    />
                </div>
                <input
                    id="cardColorHex"
                    type="text"
                    value={cardColor.toUpperCase()}
                    onChange={(e) => setCardColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    aria-label="Código de color hexadecimal"
                />
            </div>
          </div>

          {/* Stamp Customization Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-black">Personalización de Sellos</h3>
            
            {/* Icon Selector */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Icono del Sello
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'star', component: StarIcon },
                  { id: 'coffee', component: CoffeeIcon },
                  { id: 'heart', component: HeartIcon },
                  { id: 'scissors', component: ScissorsIcon },
                  { id: 'gift', component: GiftIcon },
                ].map((icon) => (
                  <button
                    key={icon.id}
                    onClick={() => setStampIconType(icon.id as any)}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                      stampIconType === icon.id 
                        ? 'border-black bg-gray-50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <icon.component className="w-6 h-6" style={{ color: stampIconType === icon.id ? stampColor : '#9CA3AF' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Stamp Color Picker */}
            <div>
              <label htmlFor="stampColorHex" className="block text-base font-medium text-gray-700 mb-1">
                Color del Sello
              </label>
              <div className="mt-1 flex items-center gap-3">
                <div className="relative w-12 h-10">
                    <div 
                        className="w-full h-full rounded-md border border-gray-300"
                        style={{ backgroundColor: stampColor }}
                    ></div>
                    <input
                        type="color"
                        value={stampColor}
                        onChange={(e) => setStampColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Seleccionar color del sello"
                    />
                </div>
                <input
                    id="stampColorHex"
                    type="text"
                    value={stampColor.toUpperCase()}
                    onChange={(e) => setStampColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Custom Stamp Upload (Premium) */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                Sello Personalizado (PNG)
                {isFreePlan && <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"><LockIcon /> Premium</span>}
              </label>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {customStampUrl ? (
                    <img src={customStampUrl} alt="Custom stamp" className="w-full h-full object-contain" />
                  ) : (
                    <UploadIcon className="text-gray-300" />
                  )}
                </div>
                <div className="flex-grow">
                  <input 
                    type="file" 
                    id="customStampInput"
                    onChange={handleCustomStampUpload}
                    accept="image/png"
                    disabled={isFreePlan}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('customStampInput')?.click()}
                    disabled={isFreePlan}
                    className={`w-fit py-2 px-3 text-sm font-medium rounded-md border transition-colors flex items-center justify-center gap-2 ${
                      isFreePlan 
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <UploadIcon className="w-4 h-4" />
                    {customStampUrl ? 'Cambiar Sello' : 'Subir PNG transparente'}
                  </button>
                  {customStampUrl && !isFreePlan && (
                    <button 
                      onClick={() => { setCustomStampUrl(''); setStampIconType('star'); }}
                      className="mt-2 text-xs text-red-600 hover:underline"
                    >
                      Eliminar y volver a icono estándar
                    </button>
                  )}
                </div>
              </div>
              {isFreePlan && <p className="mt-1.5 text-xs text-gray-500">Mejora al Plan Entrepreneur para usar tu propio diseño de sello.</p>}
            </div>
          </div>
           <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              {t('card.textColorLabel')}
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-md">
                <button
                    onClick={() => setTextColorScheme('dark')}
                    className={`px-3 py-1.5 text-base font-medium rounded-md transition-colors ${
                        textColorScheme === 'dark' ? 'bg-white shadow-sm text-black' : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    {t('card.dark')}
                </button>
                <button
                    onClick={() => setTextColorScheme('light')}
                    className={`px-3 py-1.5 text-base font-medium rounded-md transition-colors ${
                        textColorScheme === 'light' ? 'bg-white shadow-sm text-black' : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    {t('card.light')}
                </button>
            </div>
          </div>
           <div>
            <label htmlFor="sampleStamps" className="block text-base font-medium text-gray-700 mb-1">
              {t('card.sampleStamps')} ({sampleStamps})
            </label>
            <input
              id="sampleStamps"
              type="range"
              min="0"
              max={stampsGoal}
              value={sampleStamps}
              onChange={(e) => setSampleStamps(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4D17FF]"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 px-4 font-semibold text-white rounded-md transition-colors bg-black hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSaving ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </div>
      
      {/* Card Preview */}
      <div className="lg:sticky lg:top-8 h-full flex flex-col items-center">
        {/* Preview Mode Selector */}
        <div className="mb-6 flex p-1 bg-gray-100 rounded-xl w-full max-w-sm">
          <button
            onClick={() => setPreviewMode('web')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${previewMode === 'web' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Web
          </button>
          <button
            onClick={() => setPreviewMode('apple')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${previewMode === 'apple' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Apple Wallet
          </button>
          <button
            onClick={() => setPreviewMode('google')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${previewMode === 'google' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Google Wallet
          </button>
        </div>

        <div className="mb-8 flex justify-center w-full">
          <div 
            className="relative flex items-center w-full max-w-sm bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" 
            ref={shareMenuRef}
            onClick={() => setShowShareMenu(!showShareMenu)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setShowShareMenu(!showShareMenu)}
          >
            <div className="flex-1 text-center text-xl font-medium text-black truncate select-none">
                {publicCardUrl.replace(/^https?:\/\/(www\.)?/, '') || 'loyalfly.com.mx/view/tu-negocio'}
            </div>
            <div className="ml-2 p-1 text-black">
                <ShareIcon />
            </div>
            
            {showShareMenu && (
              <div 
                className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {!showQrPreview ? (
                  <>
                    <button
                      onClick={() => {
                        handleCopyUrl();
                        setShowShareMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50"
                    >
                      {copied ? <CheckIconSuccess /> : <CopyIcon />}
                      {t('card.copyUrl')}
                    </button>
                    <button
                      onClick={() => setShowQrPreview(true)}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50"
                    >
                      <QRIcon />
                      {t('card.generateQr')}
                    </button>
                    <a
                      href={publicCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowShareMenu(false)}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <ExternalLinkIcon />
                      Ver mi tarjeta
                    </a>
                  </>
                ) : (
                  <div className="p-6 flex flex-col items-center">
                    <div className="flex items-center justify-between w-full mb-4">
                      <button 
                        onClick={() => setShowQrPreview(false)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <ArrowLeftIcon />
                      </button>
                      <span className="font-bold text-gray-800">Código QR</span>
                      <div className="w-7"></div> {/* Spacer */}
                    </div>
                    
                    <p className="text-center text-xs text-gray-500 mb-6 px-2">
                      Este es el código QR exclusivo de tu negocio. Al escanearlo, tus clientes accederán directamente a tu tarjeta de fidelización Loyalfly.
                    </p>
                    
                    <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-sm mb-6">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicCardUrl)}`} 
                        alt="QR Preview" 
                        className="w-40 h-40"
                      />
                    </div>
                    
                    <button
                      onClick={handleDownloadQr}
                      className="w-full py-3 px-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShareIcon />
                      Descargar PNG (2000x2000)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full animate-fade-in">
          {previewMode === 'web' && (
            <CardPreview 
                businessName={businessName}
                rewardText={rewardText}
                cardColor={cardColor}
                stamps={sampleStamps}
                textColorScheme={textColorScheme}
                logoUrl={logoUrl}
                stampsGoal={stampsGoal}
                stampIconType={stampIconType}
                stampColor={stampColor}
                customStampUrl={customStampUrl}
                customerName={mockCustomer.name}
                customerPhone={mockCustomer.phone}
                customerId={mockCustomer.id}
            />
          )}
          {previewMode === 'apple' && renderAppleWallet()}
          {previewMode === 'google' && renderGoogleWallet()}
        </div>
      </div>
    </div>
  );
};

export default CardEditorPage;
