/* ============================================================
   CONTACT FORM — powered by Resend via Cloudflare Worker
   ============================================================
   STEP 1: Deploy cloudflare-worker.js to Cloudflare Workers
           and set RESEND_API_KEY env variable there.
   STEP 2: Paste your Worker URL below (no trailing slash).
   ============================================================ */

const WORKER_URL = 'https://contact-form.jaideeprao22.workers.dev';
// Example: 'https://contact-form.jaideeprao22.workers.dev'

/* ─────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const status  = document.getElementById('form-status');
  const btn     = form.querySelector('[type="submit"]');

  /* Honeypot */
  const trap = form.querySelector('[name="botcheck"]');
  if (trap && trap.value) { form.reset(); return; }

  /* Config check */
  if (!WORKER_URL || WORKER_URL.startsWith('PASTE_')) {
    showStatus(status, 'error',
      'Contact form not yet connected. Paste your Cloudflare Worker URL in <code>js/contact.js</code>.'
    );
    return;
  }

  const name    = form.elements['name'].value.trim();
  const email   = form.elements['email'].value.trim();
  const subject = form.elements['subject'].value.trim();
  const message = form.elements['message'].value.trim();

  if (!name || !email || !message) {
    showStatus(status, 'warn', 'Please fill in your name, email, and message.');
    return;
  }

  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span>Sending…</span>';
  showStatus(status, '', '');

  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message, botcheck: '' })
    });

    const result = await res.json();

    if (res.ok && result.success) {
      showStatus(status, 'success',
        "<strong>Message sent.</strong> I'll reply within 24–48 hours."
      );
      form.reset();
    } else {
      throw new Error(result.error || `Submission failed (${res.status})`);
    }
  } catch (err) {
    showStatus(status, 'error',
      `<strong>Could not send message.</strong> ${escapeHtml(err.message)}`
    );
  } finally {
    btn.disabled  = false;
    btn.innerHTML = originalHTML;
  }
}

function showStatus(el, kind, html) {
  if (!el) return;
  if (!html) { el.innerHTML = ''; el.className = ''; return; }
  el.className = 'form-status form-status-' + (kind || 'info');
  el.innerHTML = html;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
