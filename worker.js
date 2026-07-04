const ALLOWED_ORIGIN = 'https://jaideeprao.com';
const FROM_EMAIL     = 'contact@jaideeprao.com';
const TO_EMAIL       = 'jaideeprao22@gmail.com';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }
    if (request.method !== 'POST') {
      return cors(new Response('Method not allowed', { status: 405 }));
    }
    let data;
    try { data = await request.json(); }
    catch { return cors(json({ error: 'Invalid JSON' }, 400)); }

    const { name, email, subject, message, botcheck } = data;
    if (botcheck) return cors(json({ success: true }));
    if (!name || !email || !message) {
      return cors(json({ error: 'Name, email and message are required.' }, 400));
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: `[jaideeprao.com] ${subject || 'Website enquiry'} — from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#222;">
            <h2 style="color:#7c5cff;margin-bottom:4px;">New message from jaideeprao.com</h2>
            <p style="color:#888;font-size:13px;margin-top:0;">Reply directly to this email to respond to ${esc(name)}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr style="background:#f9f9f9;"><td style="padding:10px 12px;font-weight:600;width:90px;color:#555;">Name</td><td style="padding:10px 12px;">${esc(name)}</td></tr>
              <tr><td style="padding:10px 12px;font-weight:600;color:#555;">Email</td><td style="padding:10px 12px;"><a href="mailto:${esc(email)}" style="color:#7c5cff;">${esc(email)}</a></td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:10px 12px;font-weight:600;color:#555;">Subject</td><td style="padding:10px 12px;">${esc(subject || '—')}</td></tr>
            </table>
            <div style="background:#f5f4ff;border-left:4px solid #7c5cff;padding:16px 20px;border-radius:0 8px 8px 0;">
              <p style="margin:0;white-space:pre-wrap;line-height:1.65;">${esc(message)}</p>
            </div>
          </div>`
      })
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok) return cors(json({ success: true }));
    return cors(json({ error: result.message || 'Send failed' }, 500));
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
function cors(response) {
  const r = new Response(response.body, response);
  r.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  r.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  r.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return r;
}
function esc(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
