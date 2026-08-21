"use client";

import React, { useState, useEffect } from "react";

type Screen = "onboarding" | "dashboard" | "float_flow" | "scanner" | "verification" | "confirmation" | "tracker";
type Archetype = "palengke" | "street_food" | "sari_sari" | "wholesale" | null;
type Persona = "aling_tess" | "juns_lpg";
type Advance = {
  id: string;
  type: "float" | "tsek";
  amount: number;
  date: string;
  status: "active" | "cleared" | "pending";
  paidAmount?: number;
  dueDate?: string;
  issuerName?: string;
  checkNumber?: string;
  days?: number;
};

interface Check {
  id: string;
  amount: number;
  bank: string;
  days: number;
  issuer: string;
  number: string;
  account: string;
}

const DEMO_CHECKS: Check[] = [
  { id: 'A', amount: 30000, bank: 'BPI', days: 7, issuer: 'Mang Juan Grill', number: '1029384756', account: '0011-2233-44' },
  { id: 'B', amount: 50000, bank: 'UnionBank', days: 30, issuer: 'Golden Fork Resto', number: '5647382910', account: '9988-7766-55' },
  { id: 'C', amount: 100000, bank: 'BDO', days: 60, issuer: 'Metro Bakery Chain', number: '2039485761', account: '5544-3322-11' },
];

export default function GAgadApp() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [balance, setBalance] = useState<number>(14250.00);
  const [archetype, setArchetype] = useState<Archetype>(null);
  const [persona, setPersona] = useState<Persona>("aling_tess");
  const [activeAdvances, setActiveAdvances] = useState<Advance[]>([]);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [lastAdvance, setLastAdvance] = useState<Advance | null>(null);
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  const floatLimit = archetype === "wholesale" ? 10000 : (archetype === "sari_sari" ? 5000 : 2500);

  return (
    <div className="device-frame">
      <div className="app-container" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        
        {screen === "onboarding" && (
          <Onboarding 
            archetype={archetype}
            setArchetype={setArchetype}
            onStart={() => setScreen("dashboard")}
          />
        )}

        {screen === "dashboard" && (
          <Dashboard 
            balance={balance} 
            format={formatCurrency} 
            floatLimit={floatLimit}
            persona={persona}
            setPersona={setPersona}
            activeAdvances={activeAdvances}
            onFloat={() => setScreen("float_flow")}
            onScan={() => setScreen("scanner")} 
            onTracker={() => setScreen("tracker")}
          />
        )}

        {screen === "float_flow" && (
          <FloatFlow 
            limit={floatLimit}
            format={formatCurrency}
            onConfirm={(amount: number) => {
              const advance: Advance = {
                id: `FLT-${Math.floor(Math.random() * 10000)}`,
                type: "float",
                amount: amount,
                date: new Date().toISOString(),
                status: "active",
                paidAmount: 0
              };
              setActiveAdvances([advance, ...activeAdvances]);
              setBalance(prev => prev + amount);
              setLastAdvance(advance);
              setScreen("confirmation");
            }}
            onCancel={() => setScreen("dashboard")}
          />
        )}
        
        {screen === "scanner" && (
          <Scanner 
            onSelect={(check: Check) => { 
              setSelectedCheck(check); 
              setScreen("verification"); 
            }} 
            onCancel={() => setScreen("dashboard")} 
          />
        )}
        
        {screen === "verification" && selectedCheck && (
          <Verification 
            check={selectedCheck} 
            format={formatCurrency} 
            onConfirm={(cashout: number) => { 
              const advance: Advance = {
                id: `PDC-${selectedCheck.number}`,
                type: "tsek",
                amount: cashout,
                date: new Date().toISOString(),
                status: "active",
                dueDate: new Date(Date.now() + selectedCheck.days * 86400000).toISOString(),
                issuerName: selectedCheck.issuer,
                checkNumber: selectedCheck.number,
                days: selectedCheck.days
              };
              setActiveAdvances([advance, ...activeAdvances]);
              setBalance(prev => prev + cashout); 
              setLastAdvance(advance);
              setScreen("confirmation"); 
            }} 
            onCancel={() => setScreen("scanner")} 
          />
        )}
        
        {screen === "confirmation" && lastAdvance && (
          <Confirmation 
            advance={lastAdvance} 
            format={formatCurrency} 
            onNext={() => setScreen("tracker")} 
            onHome={() => setScreen("dashboard")} 
          />
        )}
        
        {screen === "tracker" && (
          <Tracker 
            advances={activeAdvances} 
            format={formatCurrency} 
            onHome={() => setScreen("dashboard")} 
          />
        )}
      </div>
    </div>
  );
}

// --- SCREEN 0: Onboarding ---
function Onboarding({ archetype, setArchetype, onStart }: any) {
  // Set default if not set
  useEffect(() => { if (!archetype) setArchetype("palengke"); }, [archetype, setArchetype]);

  const categories = [
    { id: "palengke", title: "Palengke / Wet Market", desc: "Dawn restocking • 4:00 AM float", icon: "🐟" },
    { id: "street_food", title: "Street Food / Carinderia", desc: "Afternoon prep • 1:00 PM float", icon: "🍢" },
    { id: "sari_sari", title: "Sari-Sari Store", desc: "Steady inventory turnover", icon: "🏪" },
    { id: "wholesale", title: "Wholesale / LPG Dealer", desc: "Trade credit & PDC factoring", icon: "🚚" }
  ];

  return (
    <div className="flex-col w-full h-full relative" style={{ backgroundColor: '#F8FAFC', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      
      {/* HEADER CARD */}
      <div style={{ backgroundColor: '#005CEE', borderRadius: '0 0 24px 24px', paddingTop: '36px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px', zIndex: 10, position: 'relative' }}>
        {/* Top Navigation */}
        <div className="flex justify-end items-center">
          <span style={{ color: 'white', fontSize: '11px', fontWeight: '600', opacity: 0.85, marginBottom: '6px' }}>Hakbang 1 ng 2</span>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-2">
          <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>I-set up ang Iyong Negosyo</h1>
          <p style={{ color: '#E0ECFF', fontSize: '13px', lineHeight: 1.4 }}>
            Piliin ang uri ng negosyo para maitugma ang tamang float at oras ng restocking.
          </p>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 no-scrollbar" style={{ paddingBottom: '20px' }}>
        <div className="flex-col" style={{ gap: '8px' }}>
          {categories.map((cat: any) => {
            const isSelected = archetype === cat.id;
            return (
              <div 
                key={cat.id} 
                onClick={() => setArchetype(cat.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: '16px',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  border: isSelected ? '2px solid #005CEE' : '1px solid #E2E8F0',
                  background: isSelected ? '#F0F6FF' : '#FFFFFF',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 92, 238, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
                  transform: 'scale(1)'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.99)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Left: Icon Squircle */}
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: isSelected ? '#FFFFFF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginRight: '14px', flexShrink: 0, border: isSelected ? '1px solid #E0ECFF' : 'none' }}>
                  {cat.icon}
                </div>
                
                {/* Center: Text */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#1E293B', fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{cat.title}</h3>
                  <p style={{ color: '#64748B', fontSize: '11px' }}>{cat.desc}</p>
                </div>

                {/* Right: Radio */}
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: isSelected ? '6px solid #005CEE' : '2px solid #CBD5E1', backgroundColor: '#FFFFFF', flexShrink: 0, transition: 'all 0.2s ease' }} />
              </div>
            );
          })}
        </div>

        {/* Machine Learning Dataset Indicator */}
        <div className="animate-slide-up" style={{ margin: '12px 0 100px 0', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '8px 12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ fontSize: '14px', marginTop: '2px' }}>✨</div>
          <div>
            <h4 style={{ color: '#15803D', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Powered by GCash Archetype Data</h4>
            <p style={{ color: '#166534', fontSize: '11px', lineHeight: 1.3 }}>Auto-calibrating float & repayment based on 10k+ similar merchants.</p>
          </div>
        </div>
      </div>

      {/* BOTTOM STICKY CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px 20px', background: 'linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0))', zIndex: 50 }}>
        <button 
          onClick={onStart}
          style={{ 
            width: '100%', height: '52px', borderRadius: '26px', 
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #005CEE 0%, #007DFE 100%)',
            boxShadow: '0 8px 20px rgba(0, 92, 238, 0.3)',
            color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          Simulan ang GAgad <span>→</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 1: Dashboard ---
function Dashboard({ balance, format, floatLimit, persona, setPersona, activeAdvances, onFloat, onScan, onTracker }: any) {
  const currentProfile = persona === "aling_tess" 
    ? { name: "Aling Tess Fresh Fish", type: "Palengke Vendor" }
    : { name: "Jun's LPG & Gas", type: "Independent Dealer" };

  return (
    <div className="flex-col w-full animate-slide-up no-scrollbar" style={{ position: 'absolute', inset: 0, animationDuration: '0.2s', overflowY: 'auto' }}>
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-6">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setPersona(persona === "aling_tess" ? "juns_lpg" : "aling_tess")}
            style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '24px' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '14px' }}>👤</span>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'white'}}>{currentProfile.name}</div>
              <div className="text-xs" style={{ color: 'white', opacity: 0.8}}>{currentProfile.type} ▾</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '16px 20px', borderRadius: '16px', marginTop: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <p className="text-sm" style={{ color: 'white', opacity: 0.9}}>GCash Wallet Balance</p>
          <h1 className="text-4xl mt-1" style={{ color: 'white', letterSpacing: '-0.5px'}}>{format(balance)}</h1>
        </div>
      </div>
      
      <div className="flex-1" style={{ paddingLeft: '16px', paddingRight: '16px', paddingBottom: '32px', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
        
        <p className="text-center font-bold text-sm" style={{ color: 'var(--primary-blue)', background: '#FFFFFF', borderRadius: '16px', padding: '8px 16px', margin: '-16px 0 16px 0', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
          "Pondo at tseke, pasok agad."
        </p>

        {/* GAgad Float Card */}
        <div className="card" style={{ padding: '16px', marginBottom: '12px', background: 'linear-gradient(145deg, #ffffff, #F8FAFC)', border: '1px solid #E2E8F0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', width: '100%' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '18px' }}>⚡</span>
                <h3 style={{ fontSize: '16px', color: 'var(--primary-blue)', margin: 0, fontWeight: 'bold' }}>GAgad Float</h3>
              </div>
              <p className="text-xs text-muted">Daily restocking micro-advances</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted mb-0.5">Available Limit:</p>
              <p className="font-bold" style={{ fontSize: '18px', color: '#0F172A' }}>{format(floatLimit)}</p>
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={onFloat} style={{ padding: '12px', borderRadius: '12px', fontSize: '14px', boxShadow: '0 4px 10px rgba(0, 92, 238, 0.2)' }}>
            Gamitin Ngayon
          </button>
        </div>
        
        {/* GAgad Tsek Card */}
        <div className="card" style={{ padding: '16px', marginBottom: '12px', background: 'linear-gradient(145deg, #ffffff, #F0FDF4)', border: '1px solid #BBF7D0', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', width: '100%' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '18px' }}>🧾</span>
                <h3 style={{ fontSize: '16px', color: 'var(--accent-green)', margin: 0, fontWeight: 'bold' }}>GAgad Tsek</h3>
              </div>
              <p className="text-xs text-muted" style={{ maxWidth: '180px', lineHeight: 1.3 }}>Instant PDC discounting for immediate cash</p>
            </div>
          </div>
          
          <button className="btn btn-success" onClick={onScan} style={{ padding: '12px', borderRadius: '12px', fontSize: '14px', boxShadow: '0 4px 10px rgba(0, 196, 140, 0.2)' }}>
            Scan Post-Dated Check
          </button>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ color: '#1E293B', fontSize: '16px', fontWeight: 'bold' }}>Active Advances</h4>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#005CEE', cursor: 'pointer' }} onClick={onTracker}>View All</span>
        </div>
        
        {activeAdvances.length === 0 ? (
          <div className="card text-center" style={{ padding: '24px', boxShadow: 'none', border: '1px dashed #CBD5E1', background: 'transparent', width: '100%' }}>
            <p className="text-sm text-muted">Walang active na advance sa ngayon.</p>
          </div>
        ) : (
          <div className="flex-col" style={{ gap: '12px', width: '100%' }}>
            {activeAdvances.slice(0, 2).map((adv: Advance) => (
              <div key={adv.id} className="card flex-col gap-2" style={{ padding: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%' }} onClick={onTracker}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '14px' }}>{adv.type === 'float' ? '⚡' : '🧾'}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B'}}>{format(adv.amount)}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '500', background: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '99px' }}>
                    In Progress
                  </span>
                </div>
                <div className="flex justify-between items-center pl-6">
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{adv.type === 'float' ? 'Float Advance' : 'PDC Cashout'}</span>
                  {adv.type === 'float' ? (
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#005CEE' }}>{Math.round(((adv.paidAmount || 0) / adv.amount) * 100)}% Cleared</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#64748B', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adv.issuerName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- SCREEN 2: Float Flow ---
function FloatFlow({ limit, format, onConfirm, onCancel }: any) {
  const [amount, setAmount] = useState(1200);
  const [dailySales, setDailySales] = useState(2000);
  const deductionRate = 0.08;
  const dailyDeduction = dailySales * deductionRate;
  const estimatedDays = Math.ceil(amount / dailyDeduction) || 0;

  return (
    <div className="flex-col animate-slide-up h-full w-full bg-white relative" style={{ position: 'absolute', inset: 0 }}>
      <div className="flex items-center border-b" style={{ padding: '16px', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>GAgad Float</span>
      </div>

      <div className="flex-1 flex-col overflow-y-hidden px-4 py-4">
        <div className="text-center mb-4">
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0F9FF', color: 'var(--primary-blue)', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <h2 className="text-xl font-bold">Piliin ang Float Amount</h2>
          <p className="text-xs text-muted mt-1">Instant puhunan para sa GCash Wallet mo.</p>
        </div>

        <div className="flex justify-between gap-2 mb-4">
          {[500, 1200, 2500].map(amt => (
            <div 
              key={amt}
              onClick={() => setAmount(amt)}
              className="card text-center"
              style={{ 
                flex: 1, 
                padding: '12px 4px', 
                cursor: 'pointer',
                background: amount === amt ? 'var(--primary-blue)' : 'white',
                color: amount === amt ? 'white' : 'var(--text-main)',
                border: amount === amt ? '2px solid var(--primary-blue)' : '2px solid var(--border-color)',
                boxShadow: amount === amt ? '0 4px 12px rgba(0, 92, 238, 0.2)' : 'none'
              }}
            >
              <span className="font-bold" style={{ fontSize: '15px' }}>₱{amt}</span>
            </div>
          ))}
        </div>

        <div className="card flex-col gap-3" style={{ padding: '16px', background: 'var(--background)', boxShadow: 'none' }}>
          <div>
            <h3 className="font-bold mb-1" style={{ fontSize: '14px' }}>Paano ang bayad?</h3>
            <p className="text-xs text-muted" style={{ lineHeight: 1.3 }}>
              Walang fixed due date. Awtomatikong <b>8% kaltas</b> sa bawat QR Ph benta hanggang matapos.
            </p>
          </div>

          <div style={{ background: 'white', padding: '12px', borderRadius: '12px' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Estimated Daily Sales</span>
              <span className="font-bold text-sm">{format(dailySales)}</span>
            </div>
            <input 
              type="range" 
              min="500" max="5000" step="100" 
              value={dailySales}
              onChange={(e) => setDailySales(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '12px', accentColor: 'var(--primary-blue)' }}
            />
            <div className="flex justify-between border-t pt-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-center flex-1 border-r" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-xs text-muted mb-0.5" style={{ fontSize: '10px' }}>Daily Kaltas</p>
                <p className="font-bold text-success text-sm">₱{Math.round(dailyDeduction)}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-muted mb-0.5" style={{ fontSize: '10px' }}>Settlement in</p>
                <p className="font-bold text-sm">~{estimatedDays} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t mt-auto" style={{ padding: '12px 16px', zIndex: 50 }}>
        <button className="btn btn-primary" onClick={() => onConfirm(amount)}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>Tanggapin ang {format(amount)}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 3: Scanner ---
function Scanner({ onSelect, onCancel }: any) {
  const [isScanning, setIsScanning] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const timeoutRef = React.useRef<any>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
      } catch (err) {
        try { 
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); 
        } catch (errFallback) { 
          console.warn("Camera access denied or unavailable.", errFallback);
          setCameraError(true);
        }
      }
      if (stream && videoRef.current) videoRef.current.srcObject = stream;
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const handleSelect = (check: any) => {
    setIsScanning(true);
    timeoutRef.current = setTimeout(() => onSelect(check), 1500);
  };

  const handleCapture = () => {
    setIsScanning(true);
    timeoutRef.current = setTimeout(() => onSelect(DEMO_CHECKS[0]), 2000);
  };
  
  const handleCancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onCancel();
  };

  return (
    <div className="flex-col w-full animate-slide-up" style={{ position: 'absolute', inset: 0, backgroundColor: '#111', overflow: 'hidden' }}>
      {cameraError ? (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#222', zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#888', fontSize: '14px' }}>Camera simulated (Demo Mode)</p>
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
      )}
      <div className="p-4 flex justify-between items-center" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 50 }}>
        <button onClick={handleCancel} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
        <span style={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Scan PDC</span>
        <div style={{ width: '80px' }}></div>
      </div>
      <div className="flex-1 flex justify-center items-center relative p-4 mt-12" style={{ zIndex: 10 }}>
        <div style={{ width: '100%', height: '260px', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderTopLeftRadius: '16px' }}></div>
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderTopRightRadius: '16px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderBottomLeftRadius: '16px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderBottomRightRadius: '16px' }}></div>
          {isScanning && <div className="scan-line"></div>}
          <div className="absolute w-full text-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 'bold', opacity: isScanning ? 1 : 0.8 }}>
              {isScanning ? 'Extracting details...' : 'Align check within frame'}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute w-full flex justify-center" style={{ bottom: '90px', opacity: isDrawerOpen ? 0 : 1, pointerEvents: isDrawerOpen ? 'none' : 'auto', zIndex: 15 }}>
         <button onClick={handleCapture} style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', border: '4px solid white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', padding: 0 }}>
           <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white' }}></div>
         </button>
      </div>
      <div className="absolute w-full" style={{ bottom: 0, background: 'var(--background)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '16px 24px 32px 24px', zIndex: 20, transform: isDrawerOpen ? 'translateY(0)' : 'translateY(calc(100% - 76px))', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <div onClick={() => setIsDrawerOpen(!isDrawerOpen)} style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: '#CBD5E1' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Simulate Demo Check</h3>
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>{isDrawerOpen ? 'Hide' : 'Show'}</button>
        </div>
        <div style={{ opacity: isDrawerOpen ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: isDrawerOpen ? 'auto' : 'none' }}>
          <div className="flex-col gap-3 mt-4">
            {DEMO_CHECKS.map(c => (
              <div key={c.id} className="card" style={{ padding: '16px 20px', cursor: 'pointer', border: '1px solid var(--border-color)', boxShadow: 'none', background: 'white' }} onClick={() => handleSelect(c)}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xl" style={{ color: 'var(--text-main)'}}>{c.amount.toLocaleString()}</span>
                  <span className="text-xs font-bold" style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '8px', color: 'var(--text-main)' }}>Due in {c.days} Days</span>
                </div>
                <div className="text-sm text-muted">{c.bank} • {c.issuer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN 4: Verification ---
function Verification({ check, format, onConfirm, onCancel }: any) {
  const getFeePercentage = (days: number) => days <= 7 ? 1.2 : days <= 15 ? 2.0 : days <= 30 ? 3.5 : 5.0;
  const percentage = getFeePercentage(check.days);
  const feeAmount = check.amount * (percentage / 100);
  const netAmount = check.amount - feeAmount;

  return (
    <div className="flex-col animate-slide-up" style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--background)' }}>
      <div className="flex items-center bg-white border-b" style={{ padding: '16px', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Review Advance</span>
      </div>
      <div className="flex-1 flex-col gap-3 no-scrollbar" style={{ padding: '16px 16px 100px 16px', overflowY: 'auto' }}>
        <div className="card" style={{ padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', boxShadow: 'none' }}>
          <h4 className="text-xs font-bold text-success mb-2">Fuse Lending Verification</h4>
          <div className="flex-col gap-1" style={{ fontSize: '12px', color: '#166534' }}>
            <div className="flex items-center gap-2"><span>✔</span> Check OCR Verified</div>
            <div className="flex items-center gap-2"><span>✔</span> Issuer GScore: 745 (Low Risk)</div>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-xs font-bold mb-2 border-b pb-2">Check Details</h4>
          <div className="flex justify-between mb-1.5"><span className="text-xs text-muted">Issuer</span><span className="text-xs font-medium">{check.issuer}</span></div>
          <div className="flex justify-between mb-1.5"><span className="text-xs text-muted">Bank</span><span className="text-xs font-medium">{check.bank}</span></div>
          <div className="flex justify-between mb-1.5"><span className="text-xs text-muted">Check No.</span><span className="text-xs font-medium">{check.number}</span></div>
          <div className="flex justify-between"><span className="text-xs text-muted">Maturity</span><span className="text-xs font-medium">{check.days} Days</span></div>
        </div>
        <div className="card" style={{ padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-xs font-bold mb-2 border-b pb-2">Discounting Engine</h4>
          <div className="flex justify-between mb-1.5"><span className="text-xs text-muted">Face Value</span><span className="text-xs font-medium">{format(check.amount)}</span></div>
          <div className="flex justify-between mb-2.5"><span className="text-xs text-muted">Financing Fee ({percentage}%)</span><span className="text-xs font-medium" style={{ color: '#ef4444' }}>- {format(feeAmount)}</span></div>
          <div className="border-t pt-2.5 flex justify-between items-center"><span className="text-xs font-bold">Net Instant Cashout</span><span className="text-lg font-bold text-success">{format(netAmount)}</span></div>
        </div>
      </div>
      <div className="bg-white border-t absolute" style={{ bottom: 0, left: 0, width: '100%', padding: '16px 16px 32px 16px', zIndex: 50 }}>
        <button className="btn btn-success w-full" onClick={() => onConfirm(netAmount)}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>Advance {format(netAmount)}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 5: Confirmation ---
function Confirmation({ advance, format, onNext, onHome }: any) {
  return (
    <div className="flex-col animate-slide-up text-center h-full w-full" style={{ position: 'absolute', inset: 0, backgroundColor: 'white', justifyContent: 'center', padding: '16px' }}>
      <div className="mb-6 flex justify-center mt-auto">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E6F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px', color: '#00C48C' }}>✓</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Advance Successful</h2>
      <p className="text-sm text-muted mb-6">
        <span className="font-bold text-success" style={{ fontSize: '18px' }}>{format(advance.amount)}</span> credited to your GCash Wallet.
      </p>
      <div className="card text-left mb-auto w-full" style={{ background: 'var(--background)', boxShadow: 'none' }}>
        <div className="flex justify-between mb-2"><span className="text-xs text-muted">Ref. Number</span><span className="text-xs font-bold">{advance.id}</span></div>
        <div className="flex justify-between mb-2"><span className="text-xs text-muted">Type</span><span className="text-xs font-bold">{advance.type === 'float' ? 'GAgad Float' : 'GAgad Tsek'}</span></div>
        {advance.type === 'tsek' && (
          <div className="flex justify-between"><span className="text-xs text-muted">Auto-Settlement Date</span><span className="text-xs font-bold">In {advance.days} Days</span></div>
        )}
      </div>
      <div className="flex-col gap-3 w-full mb-8" style={{ padding: '0 16px' }}>
        <button className="btn btn-primary" onClick={onNext}><span style={{ color: 'white' }}>View Active Tracker</span></button>
        <button className="btn btn-outline" onClick={onHome}>Back to Dashboard</button>
      </div>
    </div>
  );
}

// --- SCREEN 6: Tracker ---
function Tracker({ advances, format, onHome }: any) {
  return (
    <div className="flex-col animate-slide-up h-full w-full" style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--background)' }}>
      <div className="flex items-center bg-white border-b" style={{ padding: '16px', zIndex: 10 }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Active Tracker</span>
      </div>
      <div className="flex-1 no-scrollbar" style={{ padding: '16px', overflowY: 'auto' }}>
        {advances.length === 0 ? (
          <p className="text-center text-muted mt-8">Walang active na advances.</p>
        ) : advances.map((adv: Advance) => (
          <div key={adv.id} className="card mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div className="flex justify-between items-center mb-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <h4 className="font-bold">{adv.type === 'float' ? 'GAgad Float' : 'PDC Cashout'}</h4>
                <p className="text-xs text-muted">{adv.type === 'tsek' ? adv.issuerName : `Credited on ${new Date(adv.date).toLocaleDateString()}`}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg" style={{ color: adv.type === 'float' ? 'var(--primary-blue)' : 'var(--accent-green)' }}>{format(adv.amount)}</span>
                <p className="text-xs font-bold mt-1 uppercase" style={{ color: 'var(--text-muted)' }}>{adv.id}</p>
              </div>
            </div>

            {adv.type === 'float' ? (
              <div className="relative pt-2 pb-2">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-primary">{Math.round(((adv.paidAmount || 0) / adv.amount) * 100)}% Cleared</span>
                  <span>{format(adv.amount)}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round(((adv.paidAmount || 0) / adv.amount) * 100)}%`, height: '100%', background: 'var(--primary-blue)' }}></div>
                </div>
                <p className="text-xs text-muted mt-3 text-center">Binabawas araw-araw sa QR Ph sales mo.</p>
              </div>
            ) : (
              <div className="relative pt-2 pb-2">
                <div style={{ position: 'absolute', left: '11px', top: '16px', bottom: '16px', width: '2px', background: '#E5E7EB', zIndex: 0 }}></div>
                <div className="flex gap-4 items-start mb-6 relative z-10">
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><span style={{ color: 'white', fontSize: '12px' }}>✓</span></div>
                  <div><h5 className="text-sm font-bold text-success">Advanced (Funds Released)</h5><p className="text-xs text-muted mt-1">{new Date(adv.date).toLocaleDateString()}</p></div>
                </div>
                <div className="flex gap-4 items-start mb-6 relative z-10">
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div></div>
                  <div><h5 className="text-sm font-bold text-primary">Awaiting Maturity</h5><p className="text-xs text-muted mt-1">Due: {new Date(adv.dueDate || '').toLocaleDateString()}</p></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
