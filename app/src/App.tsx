import { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  Bell,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Check,
  Car,
  Navigation,
  Shield,
} from 'lucide-react';
import {
  MAFRAQ_LOCATIONS,
  AMMAN_LOCATIONS,
  MOCK_DRIVERS,
  calculateFare,
  getDuration,
  getDistance,
  type RideType,
  type RideStatus,
  type Driver,
  type Location,
} from './data/locations';

const STEPS = ['بحث', 'قبول', 'وصول', 'رحلة', 'انتهاء'];

export default function App() {
  const [pickup, setPickup] = useState<Location>(MAFRAQ_LOCATIONS[0]);
  const [dropoff, setDropoff] = useState<Location>(AMMAN_LOCATIONS[0]);
  const [rideType, setRideType] = useState<RideType>('private');
  const [status, setStatus] = useState<RideStatus>('idle');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [rating, setRating] = useState(0);
  const [carPos, setCarPos] = useState({ top: '40%', right: '42%' });

  const fare = calculateFare(rideType);
  const duration = getDuration();
  const distance = getDistance();

  const stepIndex = {
    idle: -1,
    searching: 0,
    matched: 1,
    arriving: 2,
    in_progress: 3,
    completed: 4,
  }[status];

  const startBooking = useCallback(() => {
    setStatus('searching');
    setDriver(null);
    setRating(0);
  }, []);

  useEffect(() => {
    if (status !== 'searching') return;

    const timer = setTimeout(() => {
      const d = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
      setDriver(d);
      setStatus('matched');
    }, 2500);

    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'matched') return;

    const timer = setTimeout(() => setStatus('arriving'), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'arriving') return;

    const timer = setTimeout(() => {
      setStatus('in_progress');
      setCarPos({ top: '30%', right: '50%' });
    }, 3000);
    return () => clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (status !== 'in_progress') return;

    const moves = [
      { top: '35%', right: '45%' },
      { top: '50%', right: '38%' },
      { top: '60%', right: '30%' },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < moves.length) {
        setCarPos(moves[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStatus('completed'), 1500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status]);

  const resetRide = () => {
    setStatus('idle');
    setDriver(null);
    setRating(0);
    setCarPos({ top: '40%', right: '42%' });
  };

  const swapLocations = () => {
    const pArea = pickup.area;
    const dArea = dropoff.area;
    if (pArea === 'المفرق' && dArea === 'عمان') {
      setPickup(AMMAN_LOCATIONS[0]);
      setDropoff(MAFRAQ_LOCATIONS[0]);
    } else {
      setPickup(MAFRAQ_LOCATIONS[0]);
      setDropoff(AMMAN_LOCATIONS[0]);
    }
  };

  const allPickups = [...MAFRAQ_LOCATIONS, ...AMMAN_LOCATIONS];
  const allDropoffs = [...AMMAN_LOCATIONS, ...MAFRAQ_LOCATIONS];

  return (
    <div className="app-shell">
      <div className="status-bar">
        <span>9:41</span>
        <span>📶 🔋</span>
      </div>

      <header className="header">
        <button className="icon-btn" aria-label="القائمة">
          <Menu size={20} />
        </button>
        <div className="logo-badge">
          <div className="logo-icon">مX</div>
          <h1>مفرق إكس</h1>
        </div>
        <button className="icon-btn" aria-label="الإشعارات">
          <Bell size={20} />
        </button>
      </header>

      <div className="screen-content">
        <div className="map-area">
          <div className="map-grid" />
          <div className="road road-1" />
          <div className="road road-2" />

          {status === 'idle' && (
            <>
              <div className="map-pin pin-pickup">
                <div className="pin-dot" />
                <span className="pin-label">من: {pickup.name}</span>
              </div>
              <div className="map-pin pin-dropoff">
                <div className="pin-dot" />
                <span className="pin-label">إلى: {dropoff.name}</span>
              </div>
            </>
          )}

          {status !== 'idle' && status !== 'completed' && (
            <div className="car-marker" style={carPos}>
              <Car size={28} color="#134e4a" />
            </div>
          )}

          {status !== 'idle' && status !== 'completed' && (
            <button className="sos-btn" aria-label="طوارئ">
              SOS
            </button>
          )}

          {status === 'searching' && (
            <div className="searching-overlay fade-in">
              <div className="pulse-ring" />
              <h2>جاري البحث عن سائق...</h2>
              <p>نبحث عن أقرب سائق على خط المفرق–عمان</p>
            </div>
          )}
        </div>

        {status === 'idle' && (
          <div className="bottom-sheet fade-in">
            <div className="sheet-handle" />
            <div className="location-row">
              <div className="location-icon pickup">
                <MapPin size={18} />
              </div>
              <select
                className="location-select"
                value={pickup.id}
                onChange={(e) => {
                  const loc = allPickups.find((l) => l.id === e.target.value);
                  if (loc) setPickup(loc);
                }}
              >
                {allPickups.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.area}
                  </option>
                ))}
              </select>
            </div>
            <div className="location-row">
              <div className="location-icon dropoff">
                <Navigation size={18} />
              </div>
              <select
                className="location-select"
                value={dropoff.id}
                onChange={(e) => {
                  const loc = allDropoffs.find((l) => l.id === e.target.value);
                  if (loc) setDropoff(loc);
                }}
              >
                {allDropoffs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.area}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-secondary" onClick={swapLocations} style={{ marginTop: 8 }}>
              ⇅ عكس الاتجاه (المفرق ↔ عمان)
            </button>

            <div className="ride-types">
              <div
                className={`ride-type-card ${rideType === 'private' ? 'active' : ''}`}
                onClick={() => setRideType('private')}
                role="button"
                tabIndex={0}
              >
                <h3>🚗 خاصة</h3>
                <p>سيارة كاملة — باب لباب</p>
                <div className="price">{calculateFare('private')} د.أ</div>
              </div>
              <div
                className={`ride-type-card ${rideType === 'shared' ? 'active' : ''}`}
                onClick={() => setRideType('shared')}
                role="button"
                tabIndex={0}
              >
                <h3>👥 مشتركة</h3>
                <p>مقعد واحد — توفير 60%</p>
                <div className="price">{calculateFare('shared')} د.أ</div>
              </div>
            </div>

            <div className="fare-summary">
              <div>
                <div className="details">
                  {distance} كم • ~{duration} دقيقة
                </div>
                <div className="details">دفع نقداً عند الوصول</div>
              </div>
              <div className="total">{fare} د.أ</div>
            </div>

            <button className="btn-primary" onClick={startBooking}>
              احجز الآن
            </button>
          </div>
        )}

        {(status === 'matched' || status === 'arriving' || status === 'in_progress') && driver && (
          <div className="bottom-sheet fade-in">
            <div className="sheet-handle" />
            <div className="ride-progress">
              <div className="progress-steps">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`step ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}
                  >
                    <div className="step-dot">{i < stepIndex ? <Check size={12} /> : i + 1}</div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="driver-card">
              <div className="driver-header">
                <div className="driver-avatar">{driver.name.charAt(0)}</div>
                <div className="driver-info">
                  <h3>{driver.name}</h3>
                  <p>
                    {driver.vehicle} • {driver.color} • {driver.plate}
                  </p>
                </div>
              </div>
              <div className="driver-meta">
                <span>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" /> {driver.rating}
                </span>
                <span>{driver.trips} رحلة</span>
                <span>
                  <Shield size={14} /> موثّق
                </span>
              </div>
              <div className="driver-actions">
                <button className="btn-secondary">
                  <Phone size={16} style={{ display: 'inline', marginLeft: 6 }} />
                  اتصال
                </button>
                <button className="btn-secondary">
                  <MessageCircle size={16} style={{ display: 'inline', marginLeft: 6 }} />
                  رسالة
                </button>
              </div>
            </div>

            <div className="fare-summary">
              <div>
                <div className="details">
                  {status === 'arriving' && `يصل خلال ${driver.eta} دقائق`}
                  {status === 'in_progress' && 'الرحلة جارية — تتبع مباشر'}
                  {status === 'matched' && 'تم قبول الطلب'}
                </div>
                <div className="details">
                  {pickup.name} → {dropoff.name}
                </div>
              </div>
              <div className="total">{fare} د.أ</div>
            </div>
          </div>
        )}

        {status === 'completed' && driver && (
          <div className="bottom-sheet fade-in" style={{ textAlign: 'center', padding: '24px 20px' }}>
            <div className="success-icon">
              <Check size={40} />
            </div>
            <h2 style={{ marginBottom: 8 }}>وصلت بسلام! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
              {pickup.name} → {dropoff.name}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 20 }}>
              {fare} د.أ — نقداً
            </p>

            <p style={{ marginBottom: 8 }}>كيف كانت رحلتك مع {driver.name}؟</p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  className={`star-btn ${rating >= s ? 'active' : ''}`}
                  onClick={() => setRating(s)}
                  aria-label={`${s} نجوم`}
                >
                  ★
                </button>
              ))}
            </div>

            <button className="btn-primary" onClick={resetRide} disabled={rating === 0}>
              {rating > 0 ? 'تم — حجز رحلة جديدة' : 'قيّم الرحلة للمتابعة'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
