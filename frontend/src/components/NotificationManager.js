import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const TypeIcon = ({ type }) => {
  const c = 'w-5 h-5';
  if (type === 'chat') return (
    <svg className={c} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 5a3 3 0 013-3h10a3 3 0 013 3v9a3 3 0 01-3 3H9l-5 4V5z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (type === 'meet') return (
    <svg className={c} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7a3 3 0 013-3h8a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3V7z" stroke="#7C3AED" strokeWidth="2"/>
      <path d="M21 10l-4 3 4 3V10z" fill="#7C3AED"/>
    </svg>
  );
  if (type === 'appointment') return (
    <svg className={c} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 2v3m10-3v3M3 8h18M5 6h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a7 7 0 00-7 7v3l-2 3h18l-2-3V9a7 7 0 00-7-7zm0 20a3 3 0 003-3H9a3 3 0 003 3z" fill="#F59E0B"/>
    </svg>
  );
};

export default function NotificationManager({ actor = 'patient' }) {
  const [notifs, setNotifs] = useState([]);
  const [seenIds, setSeenIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('seenNotifIds') || '[]')); } catch(_) { return new Set(); }
  });
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  useEffect(() => {
    const handleClose = () => setNotifs([]);
    window.addEventListener('close_notif_popups', handleClose);
    return () => window.removeEventListener('close_notif_popups', handleClose);
  }, []);

  useEffect(() => {
    const origin = String(API.defaults.baseURL || '').replace(/\/(api)?$/, '');
    const w = window;
    const cleanup = [];
    const onReady = () => {
      try {
        const socket = w.io ? w.io(origin, { transports: ['polling', 'websocket'], auth: { token: localStorage.getItem('token') || '' } }) : null;
        if (socket) {
          socket.on('notify', (p) => {
            try {
              const id = String(Date.now()) + String(Math.random());
              const sid = String(p?.id || '');
              if (sid) {
                setSeenIds((prev) => {
                  const next = new Set(prev);
                  next.add(sid);
                  try { localStorage.setItem('seenNotifIds', JSON.stringify(Array.from(next))); } catch(_) {}
                  return next;
                });
              }
              window.dispatchEvent(new CustomEvent('hospozen_notif', { detail: p }));
              setNotifs((prev) => [{
                id,
                text: p?.message || '',
                link: p?.link || '',
                type: p?.type || 'general',
                kind: p?.kind || '',
                apptId: p?.apptId ? String(p.apptId) : ''
              }, ...prev].slice(0, 4));
              setTimeout(() => { setNotifs((prev) => prev.filter((n) => n.id !== id)); }, 30000);
            } catch (_) {}
          });
          cleanup.push(() => { try { socket.close(); } catch(_) {} });
        }
      } catch (_) {}
    };
    if (!token) return () => {};
    if (!w.io) {
      const s = document.createElement('script');
      s.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
      s.async = true; s.defer = true; s.onload = onReady;
      document.body.appendChild(s);
      cleanup.push(() => { try { document.body.removeChild(s); } catch(_) {} });
    } else { onReady(); }
    return () => { cleanup.forEach((fn) => fn()); };
   }, [token]);

   useEffect(() => {
     try {
       const chan = new BroadcastChannel('chatmsg');
       chan.onmessage = (e) => {
         try {
           const { apptId, actor: msgActor, kind, text: msgText } = e.data || {};
           // If we are a patient, we only care about messages from doctors
           // If we are a doctor, we only care about messages from patients
           if (actor === 'patient' && String(msgActor || '').toLowerCase() !== 'doctor') return;
           if (actor === 'doctor' && String(msgActor || '').toLowerCase() === 'doctor') return;
 
           const id = String(Date.now()) + String(Math.random());
           const sender = actor === 'patient' ? 'doctor' : 'patient';
           const text = msgText ? `New message from ${sender}: ${msgText}` : `New message from ${sender}`;
           const apptIdStr = String(apptId || '');
           window.dispatchEvent(new CustomEvent('hospozen_notif', { 
             detail: { message: text, type: 'chat', kind: kind || 'pre', apptId: apptIdStr } 
           }));
           setNotifs((prev) => [{
             id,
             text,
             type: 'chat',
             kind: kind || 'pre',
             apptId: apptIdStr
           }, ...prev].slice(0, 4));
           setTimeout(() => { setNotifs((prev) => prev.filter((n) => n.id !== id)); }, 30000);
         } catch(_) {}
       };
       return () => { try { chan.close(); } catch(_) {} };
     } catch(_) {}
   }, [actor]);

   useEffect(() => {
    const fetchNow = async () => {
      try {
        if (!token) return;
        const { data } = await API.get('/notifications', { params: { unread: 1 } });
        const items = Array.isArray(data) ? data : [];
        items.forEach((n) => {
          const sid = String(n._id || n.id || '');
          if (!sid || seenIds.has(sid)) return;
          window.dispatchEvent(new CustomEvent('hospozen_notif', { detail: n }));
          const id = String(Date.now()) + String(Math.random());
          setNotifs((prev) => [{
            id,
            text: n.message || '',
            link: n.link || '',
            type: n.type || 'general',
            apptId: n.apptId ? String(n.apptId) : ''
          }, ...prev].slice(0, 4));
          setTimeout(() => { setNotifs((prev) => prev.filter((x) => x.id !== id)); }, 30000);
          setSeenIds((prev) => {
            const next = new Set(prev); next.add(sid);
            try { localStorage.setItem('seenNotifIds', JSON.stringify(Array.from(next))); } catch(_) {}
            return next;
          });
        });
      } catch(_) {}
    };
    fetchNow();
    const t = setInterval(fetchNow, 15000);
    return () => clearInterval(t);
  }, [token, seenIds]);

  if (!token || notifs.length === 0) return null;

  return (
    <div className="absolute right-0 top-16 z-[60] space-y-2 pointer-events-none">
      {notifs.map((n, idx) => (
        <div key={n.id} className="relative">
          {idx === 0 && (
            <div className="absolute right-3 sm:right-4 -top-2 w-4 h-4 bg-white/95 border border-blue-200/50 rotate-45 z-[-1]"></div>
          )}
          <button
            onClick={async () => {
            try {
              const id = String(n.apptId || '');
              const msg = String(n.text || '').toLowerCase();
              if (actor === 'doctor') {
                if ((msg.includes('view details') || n.type === 'details') && id) {
                  nav(`/doctor/appointments/${id}/documents`);
                } else if ((id && (n.kind === 'followup' || msg.includes('follow up') || n.type === 'followup'))) {
                  try { localStorage.setItem('lastChatApptId', id); } catch(_) {}
                  nav(`/doctor/appointments/${id}/followup`);
                } else if ((n.type === 'chat' || msg.includes('new message')) && id) {
                  nav(`/doctor/appointments/${id}/documents`);
                } else {
                  nav('/doctor/appointments');
                }
              } else {
                if (n.type === 'chat' && id) {
                  try { localStorage.setItem('lastChatApptId', id); } catch(_) {}
                  nav(n.kind === 'followup' ? `/appointments/${id}/followup` : `/appointments/${id}/details`);
                } else if ((msg.includes('follow up') || n.type === 'followup') && id) {
                  nav(`/appointments/${id}/followup`);
                } else if (n.type === 'meet' && id) {
                  nav(`/appointments?joinMeet=${id}`);
                } else if (n.link) {
                  nav(n.link);
                } else {
                  nav('/appointments');
                }
              }
              setNotifs(prev => prev.filter(x => x.id !== n.id));
            } catch(_) {}
          }}
          className="block w-[85vw] sm:w-80 max-w-sm text-left px-4 py-3 rounded-2xl shadow-2xl border border-blue-200/50 bg-white/95 backdrop-blur-md hover:bg-blue-50 transition pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <TypeIcon type={n.type} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-900 font-semibold break-all">
                {n.text && n.text.length > 50 ? n.text.substring(0, 50) + '...' : n.text || 'Notification'}
              </div>
            </div>
          </div>
        </button>
        </div>
      ))}
    </div>
  );
}
