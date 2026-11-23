import { SalesTemplate } from '../types/template';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getFontStack(pair: SalesTemplate['fontPairing']): { display: string; body: string; googleQuery: string } {
  switch (pair) {
    case 'bricolage-manrope':
      return {
        display: "'Bricolage Grotesque', sans-serif",
        body: "'DM Sans', sans-serif",
        googleQuery: 'family=Bricolage+Grotesque:wght@500;600;700&family=DM+Sans:wght@400;500;600',
      };
    case 'outfit-public':
      return {
        display: "'Outfit', sans-serif",
        body: "'Public Sans', sans-serif",
        googleQuery: 'family=Outfit:wght@500;600;700&family=Public+Sans:wght@400;500;600',
      };
    case 'archivo-public':
      return {
        display: "'Archivo', sans-serif",
        body: "'Public Sans', sans-serif",
        googleQuery: 'family=Archivo:wght@500;600;700&family=Public+Sans:wght@400;500;600',
      };
    case 'playfair-dm':
      return {
        display: "'Playfair Display', Georgia, serif",
        body: "'DM Sans', sans-serif",
        googleQuery: 'family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@400;500;600',
      };
    default:
      return {
        display: "'Plus Jakarta Sans', sans-serif",
        body: "'DM Sans', sans-serif",
        googleQuery: 'family=Plus+Jakarta+Sans:wght@500;600;700&family=DM+Sans:wght@400;500;600',
      };
  }
}

export async function embedImageAsDataUrl(imageUrl: string): Promise<string> {
  if (!imageUrl || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return imageUrl;
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(typeof reader.result === 'string' ? reader.result : imageUrl);
      };
      reader.onerror = () => resolve(imageUrl);
      reader.readAsDataURL(blob);
    });
  } catch {
    return imageUrl;
  }
}

export function generateHtmlExport(template: SalesTemplate, resolvedImageSrc?: string): string {
  const heroImgSrc = resolvedImageSrc || template.heroImage;
  const fonts = getFontStack(template.fontPairing);
  const isDark = template.surface === 'obsidian-dark';
  const bgClass =
    template.surface === 'obsidian-dark'
      ? 'bg-[#0B0C0E] text-[#F4F4F5]'
      : template.surface === 'warm-stone'
        ? 'bg-[#F2EFE9] text-[#18181B]'
        : 'bg-[#E8EEF5] text-[#0F172A]';
  const cardClass = isDark
    ? 'bg-[#141619] border-[#26292E]'
    : template.surface === 'warm-stone'
      ? 'bg-[#E8E4DC] border-[#D5CFC2]'
      : 'bg-[#F4F7FA] border-[#CFD9E4]';
  const mutedClass = isDark ? 'text-[#A1A1AA]' : 'text-[#475569]';
  const borderClass = isDark ? 'border-[#26292E]' : 'border-[#CFD9E4]';

  const checkoutHref = template.checkoutUrl?.trim() || '';
  const ogImageTag =
    heroImgSrc && /^https?:\/\//i.test(heroImgSrc)
      ? `\n  <meta property="og:image" content="${escapeHtml(heroImgSrc)}" />`
      : '';

  const enabledSections = template.sections.filter((s) => s.enabled);

  const sectionsMarkup = enabledSections
    .map((sec) => {
      if (sec.id === 'hero') {
        return `
  <!-- Hero Section -->
  <section id="hero" class="max-w-6xl mx-auto px-6 py-16 md:py-24">
    <div class="${template.heroVariant === 'split-media' ? 'grid lg:grid-cols-12 gap-12 items-stretch' : 'max-w-3xl mx-auto text-center'}">
      <div class="${template.heroVariant === 'split-media' ? 'lg:col-span-6 flex flex-col justify-center' : ''}">
        <p class="text-sm font-medium ${mutedClass} mb-4">${escapeHtml(template.heroEyebrow)}</p>
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6" style="font-family:${fonts.display};text-wrap:balance;">
          ${escapeHtml(template.heroHeadline)}
        </h1>
        <p class="text-base md:text-lg ${mutedClass} leading-relaxed mb-8">${escapeHtml(template.heroSubheadline)}</p>
        <div class="${template.heroVariant === 'split-media' ? 'flex flex-wrap items-center gap-4' : 'flex flex-col items-center gap-3'}">
          <a href="${checkoutHref ? escapeHtml(checkoutHref) : '#capture'}" ${checkoutHref ? 'target="_blank" rel="noopener noreferrer"' : ''} class="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90" style="background-color:${template.accentColor};">
            ${escapeHtml(template.primaryCtaLabel)}
          </a>
          <span class="text-xs ${mutedClass}">${escapeHtml(template.trustMarker)}</span>
        </div>
        <p class="text-xs ${mutedClass} mt-4">${escapeHtml(template.secondaryNote)}</p>
      </div>
      ${
        template.heroVariant === 'split-media'
          ? `<div class="lg:col-span-6"><img src="${escapeHtml(heroImgSrc)}" alt="${escapeHtml(template.heroImageAlt)}" class="w-full h-full min-h-[320px] max-h-[460px] object-cover rounded-xl border ${borderClass}" /></div>`
          : `<div class="mt-12"><img src="${escapeHtml(heroImgSrc)}" alt="${escapeHtml(template.heroImageAlt)}" class="w-full aspect-video object-cover rounded-xl border ${borderClass}" /></div>`
      }
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14 pt-10 border-t ${borderClass}">
      ${template.kpiStrip
        .map(
          (k) => `<div>
        <div class="text-2xl md:text-3xl font-semibold tabular-nums" style="font-family:${fonts.display};">${escapeHtml(k.value)}</div>
        <div class="text-sm ${mutedClass} mt-1">${escapeHtml(k.label)}</div>
      </div>`
        )
        .join('\n      ')}
    </div>
  </section>`;
      }
      if (sec.id === 'contrast') {
        return `
  <!-- Before vs After -->
  <section id="contrast" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <h2 class="text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl mb-10" style="font-family:${fonts.display};">${escapeHtml(template.contrastHeading)}</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="p-7 rounded-xl border ${cardClass}">
        <h3 class="text-base font-semibold ${mutedClass} mb-4" style="font-family:${fonts.display};">${escapeHtml(template.beforeTitle)}</h3>
        <ul class="space-y-3 text-sm ${mutedClass}">
          ${template.beforePoints.map((pt) => `<li>✕ ${escapeHtml(pt)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="p-7 rounded-xl border ${cardClass}" style="border-color:${template.accentColor};">
        <h3 class="text-base font-semibold mb-4" style="font-family:${fonts.display};">${escapeHtml(template.afterTitle)}</h3>
        <ul class="space-y-3 text-sm">
          ${template.afterPoints.map((pt) => `<li>✓ ${escapeHtml(pt)}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>`;
      }
      if (sec.id === 'capabilities') {
        return `
  <!-- Capabilities -->
  <section id="capabilities" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <div class="max-w-2xl mb-12">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight mb-3" style="font-family:${fonts.display};">${escapeHtml(template.capabilitiesHeading)}</h2>
      <p class="text-base ${mutedClass}">${escapeHtml(template.capabilitiesIntro)}</p>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      ${template.capabilities
        .map(
          (c) => `<div class="${c.span === 2 ? 'md:col-span-2' : 'md:col-span-1'} p-7 rounded-xl border ${cardClass}">
        <h3 class="text-lg font-semibold mb-3" style="font-family:${fonts.display};">${escapeHtml(c.title)}</h3>
        <p class="text-sm ${mutedClass} leading-relaxed mb-5">${escapeHtml(c.description)}</p>
        <div class="text-xs font-medium ${mutedClass} pt-4 border-t ${borderClass}">${escapeHtml(c.deliverable)}</div>
      </div>`
        )
        .join('\n      ')}
    </div>
  </section>`;
      }
      if (sec.id === 'proof') {
        return `
  <!-- Proof & Case Studies -->
  <section id="proof" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <div class="max-w-2xl mb-12">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight mb-3" style="font-family:${fonts.display};">${escapeHtml(template.proofHeading)}</h2>
      <p class="text-base ${mutedClass}">${escapeHtml(template.proofIntro)}</p>
    </div>
    <div class="grid md:grid-cols-2 gap-8">
      ${template.proofCases
        .map(
          (p) => `<article class="p-8 rounded-xl border ${cardClass} flex flex-col justify-between gap-6">
        <div>
          <div class="text-xs ${mutedClass} mb-2">${escapeHtml(p.client)} · ${escapeHtml(p.sector)}</div>
          <div class="text-xl font-semibold mb-3 tabular-nums" style="font-family:${fonts.display};color:${isDark ? '#FBBF24' : template.accentColor};">${escapeHtml(p.metric)}</div>
          <p class="text-sm ${mutedClass} mb-5">${escapeHtml(p.context)}</p>
          <blockquote class="text-sm leading-relaxed">“${escapeHtml(p.quote)}”</blockquote>
        </div>
        <div class="pt-4 border-t ${borderClass} text-xs ${mutedClass}">
          <span class="font-semibold ${isDark ? 'text-white' : 'text-gray-900'}">${escapeHtml(p.authorName)}</span> · ${escapeHtml(p.authorRole)}
        </div>
      </article>`
        )
        .join('\n      ')}
    </div>
  </section>`;
      }
      if (sec.id === 'pricing') {
        return `
  <!-- Offer, Pricing & Guarantee -->
  <section id="pricing" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-tight max-w-xl" style="font-family:${fonts.display};">${escapeHtml(template.pricingHeading)}</h2>
      <div class="inline-flex items-center p-1 rounded-lg border ${borderClass} ${isDark ? 'bg-[#141619]' : 'bg-[#E2E9F2]'} self-start sm:self-auto">
        <button type="button" data-billing-btn="0" class="px-3.5 py-1.5 text-xs font-medium rounded-md ${isDark ? 'bg-[#26292E] text-white' : 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'}">${escapeHtml(template.pricingBillingLabels[0])}</button>
        <button type="button" data-billing-btn="1" class="px-3.5 py-1.5 text-xs font-medium rounded-md ${mutedClass}">${escapeHtml(template.pricingBillingLabels[1])}</button>
      </div>
    </div>
    <div class="grid ${template.pricingTiers.length === 1 ? 'md:grid-cols-1 max-w-2xl' : 'md:grid-cols-2'} gap-8 mb-8">
      ${template.pricingTiers
        .map(
          (t) => `<div class="p-8 rounded-xl border ${cardClass} flex flex-col justify-between" ${t.highlighted ? `style="border-color:${template.accentColor};"` : ''}>
        <div>
          <h3 class="text-xl font-semibold mb-2" style="font-family:${fonts.display};">${escapeHtml(t.name)}</h3>
          <p class="text-sm ${mutedClass} mb-6">${escapeHtml(t.summary)}</p>
          <div class="flex items-baseline gap-2 mb-6">
            <span class="text-3xl font-semibold tabular-nums" data-price-monthly="${escapeHtml(t.monthlyPrice)}" data-price-annual="${escapeHtml(t.annualPrice)}" style="font-family:${fonts.display};">${escapeHtml(t.monthlyPrice)}</span>
            <span class="text-sm ${mutedClass}">${escapeHtml(t.unitLabel)}</span>
          </div>
          <ul class="space-y-3 text-sm mb-8">
            ${t.features.map((f) => `<li class="${mutedClass}">— ${escapeHtml(f)}</li>`).join('\n            ')}
          </ul>
        </div>
        ${
          checkoutHref
            ? `<a href="${escapeHtml(checkoutHref)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg text-white" style="background-color:${template.accentColor};">${escapeHtml(t.ctaLabel)}</a>`
            : `<button type="button" data-select-tier="${escapeHtml(t.name)}" class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg text-white cursor-pointer" style="background-color:${template.accentColor};">${escapeHtml(t.ctaLabel)}</button>`
        }
      </div>`
        )
        .join('\n      ')}
    </div>
    ${
      template.mobileMoneyNote?.trim()
        ? `<div class="p-5 rounded-xl border ${cardClass} mb-6">
      <h3 class="text-sm font-semibold mb-1" style="font-family:${fonts.display};">Direct Mobile Money / Bank Payment</h3>
      <p class="text-sm ${mutedClass} leading-relaxed whitespace-pre-line">${escapeHtml(template.mobileMoneyNote.trim())}</p>
    </div>`
        : ''
    }
    <div class="p-6 rounded-xl border ${cardClass}">
      <h3 class="text-base font-semibold mb-1" style="font-family:${fonts.display};">${escapeHtml(template.guaranteeTitle)}</h3>
      <p class="text-sm ${mutedClass} leading-relaxed">${escapeHtml(template.guaranteeBody)}</p>
    </div>
  </section>`;
      }
      if (sec.id === 'faq') {
        return `
  <!-- Common Questions -->
  <section id="faq" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <div class="grid md:grid-cols-12 gap-10">
      <div class="md:col-span-4">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight" style="font-family:${fonts.display};">${escapeHtml(template.faqHeading)}</h2>
      </div>
      <div class="md:col-span-8 space-y-3">
        ${template.faqs
          .map(
            (f) => `<details class="p-5 rounded-xl border ${cardClass}">
          <summary class="text-sm font-semibold cursor-pointer">${escapeHtml(f.question)}</summary>
          <p class="text-sm ${mutedClass} mt-3 leading-relaxed">${escapeHtml(f.answer)}</p>
        </details>`
          )
          .join('\n        ')}
      </div>
    </div>
  </section>`;
      }
      if (sec.id === 'capture') {
        const formAttr =
          template.leadDestinationType === 'formspree' && template.leadDestinationValue.trim()
            ? `action="${escapeHtml(template.leadDestinationValue.trim())}" method="POST"`
            : '';

        return `
  <!-- Lead Capture -->
  <section id="capture" class="max-w-6xl mx-auto px-6 py-16 border-t ${borderClass}">
    <div class="grid md:grid-cols-12 gap-10 items-start">
      <div class="md:col-span-5">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-tight mb-3" style="font-family:${fonts.display};">${escapeHtml(template.captureHeading)}</h2>
        <p class="text-base ${mutedClass} leading-relaxed">${escapeHtml(template.captureSubheading)}</p>
        <p id="selected-tier-display" class="text-xs font-medium ${mutedClass} mt-4 hidden"></p>
      </div>
      <div class="md:col-span-7">
        <form id="lead-form" ${formAttr} class="p-7 rounded-xl border ${cardClass} space-y-4">
          <input type="hidden" name="selected_option" id="selected-tier-input" value="" />
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium ${mutedClass} mb-1.5">Full name</label>
              <input id="lead-name" name="name" type="text" required placeholder="Amina Hassan" class="w-full px-3.5 py-2.5 text-sm rounded-lg border ${borderClass} bg-transparent" />
            </div>
            <div>
              <label class="block text-xs font-medium ${mutedClass} mb-1.5">Email address</label>
              <input id="lead-email" name="email" type="email" required placeholder="amina@email.com" class="w-full px-3.5 py-2.5 text-sm rounded-lg border ${borderClass} bg-transparent" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium ${mutedClass} mb-1.5">Questions or notes</label>
            <textarea id="lead-notes" name="message" rows="3" placeholder="Ask a question or share what you are looking for..." class="w-full px-3.5 py-2.5 text-sm rounded-lg border ${borderClass} bg-transparent"></textarea>
          </div>
          <p id="lead-error" class="text-xs font-medium text-red-600 hidden"></p>
          <p id="lead-success" class="text-sm font-medium hidden" style="color:${isDark ? '#FBBF24' : template.accentColor};"></p>
          <button type="submit" class="px-6 py-3 text-sm font-semibold text-white rounded-lg cursor-pointer" style="background-color:${template.accentColor};">${escapeHtml(template.captureButtonLabel)}</button>
        </form>
      </div>
    </div>
  </section>`;
      }
      return `
  <!-- Footer -->
  <footer class="max-w-6xl mx-auto px-6 py-10 border-t ${borderClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${mutedClass}">
    <span>${escapeHtml(template.footerLegal)}</span>
    <span>${escapeHtml(template.footerContact)}</span>
  </footer>`;
    })
    .join('\n');

  const safeDestType = JSON.stringify(template.leadDestinationType);
  const safeDestValue = JSON.stringify(template.leadDestinationValue.trim());
  const safeBrand = JSON.stringify(template.brandName);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(template.brandName)} — ${escapeHtml(template.heroEyebrow)}</title>
  <meta name="description" content="${escapeHtml(template.heroSubheadline)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(template.brandName)} — ${escapeHtml(template.heroHeadline)}" />
  <meta property="og:description" content="${escapeHtml(template.heroSubheadline)}" />${ogImageTag}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(template.brandName)} — ${escapeHtml(template.heroHeadline)}" />
  <meta name="twitter:description" content="${escapeHtml(template.heroSubheadline)}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?${fonts.googleQuery}&display=swap" rel="stylesheet" />
</head>
<body class="${bgClass}" style="font-family:${fonts.body};">
  <header class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-8 border-b ${borderClass}">
    <a href="#hero" class="text-lg font-bold tracking-tight whitespace-nowrap shrink-0" style="font-family:${fonts.display};"><strong>${escapeHtml(template.brandName)}</strong></a>
    <nav class="hidden md:flex items-center gap-6 text-sm ${mutedClass}">
      ${template.navLinks
        .slice(0, 4)
        .map((l, idx) => {
          const targets = ['#contrast', '#capabilities', '#pricing', '#capture'];
          return `<a href="${targets[idx] || '#hero'}" class="hover:underline whitespace-nowrap shrink-0">${escapeHtml(l)}</a>`;
        })
        .join('\n      ')}
    </nav>
    <a href="${checkoutHref ? escapeHtml(checkoutHref) : '#capture'}" ${checkoutHref ? 'target="_blank" rel="noopener noreferrer"' : ''} class="px-4 py-2 text-xs font-semibold text-white rounded-lg whitespace-nowrap shrink-0" style="background-color:${template.accentColor};">${escapeHtml(template.primaryCtaLabel)}</a>
  </header>
${sectionsMarkup}
  ${(() => {
    const waDigits = (template.whatsappOrderNumber || '').replace(/[^0-9]/g, '');
    if (!waDigits) return '';
    const waHref = `https://wa.me/${waDigits}?text=${encodeURIComponent(
      `Hi, I'm interested in ${template.brandName}`
    )}`;
    return `<a href="${escapeHtml(waHref)}" target="_blank" rel="noopener noreferrer" class="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg shadow-lg">Order on WhatsApp</a>`;
  })()}
  <script>
    (function () {
      var billingBtns = document.querySelectorAll('[data-billing-btn]');
      var priceEls = document.querySelectorAll('[data-price-monthly]');
      billingBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.getAttribute('data-billing-btn');
          billingBtns.forEach(function (b) {
            if (b.getAttribute('data-billing-btn') === mode) {
              b.className = 'px-3.5 py-1.5 text-xs font-medium rounded-md ${isDark ? 'bg-[#26292E] text-white' : 'bg-[#FAFCFE] text-[#0F172A] shadow-xs'}';
            } else {
              b.className = 'px-3.5 py-1.5 text-xs font-medium rounded-md ${mutedClass}';
            }
          });
          priceEls.forEach(function (el) {
            el.textContent = mode === '0' ? el.getAttribute('data-price-monthly') : el.getAttribute('data-price-annual');
          });
        });
      });

      var tierBtns = document.querySelectorAll('[data-select-tier]');
      var tierInput = document.getElementById('selected-tier-input');
      var tierDisplay = document.getElementById('selected-tier-display');
      tierBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var tierName = btn.getAttribute('data-select-tier') || '';
          if (tierInput) tierInput.value = tierName;
          if (tierDisplay) {
            tierDisplay.textContent = 'Selected option: ' + tierName;
            tierDisplay.classList.remove('hidden');
          }
          var captureEl = document.getElementById('capture');
          if (captureEl) captureEl.scrollIntoView({ behavior: 'smooth' });
        });
      });

      var form = document.getElementById('lead-form');
      if (!form) return;
      var destType = ${safeDestType};
      var destValue = ${safeDestValue};
      var brand = ${safeBrand};

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('lead-name').value || '').trim();
        var email = (document.getElementById('lead-email').value || '').trim();
        var notes = (document.getElementById('lead-notes').value || '').trim();
        var tier = tierInput ? tierInput.value : '';
        var errEl = document.getElementById('lead-error');
        var okEl = document.getElementById('lead-success');

        if (!name || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
          errEl.textContent = 'Please enter your name and a valid email address.';
          errEl.classList.remove('hidden');
          okEl.classList.add('hidden');
          return;
        }
        errEl.classList.add('hidden');

        if (destType === 'formspree' && destValue) {
          fetch(destValue, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, option: tier, message: notes })
          }).then(function (res) {
            if (res.ok) {
              okEl.textContent = 'Thank you, ' + name + '. Your request has been sent.';
              okEl.classList.remove('hidden');
              form.reset();
            } else {
              errEl.textContent = 'Could not send form. Please check your endpoint or email us directly.';
              errEl.classList.remove('hidden');
            }
          }).catch(function () {
            errEl.textContent = 'Network error while sending. Please try again.';
            errEl.classList.remove('hidden');
          });
          return;
        }

        var summaryText = 'New inquiry for ' + brand + '\\nName: ' + name + '\\nEmail: ' + email + (tier ? '\\nOption: ' + tier : '') + (notes ? '\\nDetails: ' + notes : '');

        if (destType === 'whatsapp' && destValue) {
          var digits = destValue.replace(/[^0-9]/g, '');
          var waUrl = 'https://wa.me/' + digits + '?text=' + encodeURIComponent(summaryText);
          okEl.textContent = 'Opening WhatsApp message for ' + brand + '...';
          okEl.classList.remove('hidden');
          window.location.href = waUrl;
          return;
        }

        if (destValue) {
          var mailUrl = 'mailto:' + encodeURIComponent(destValue) + '?subject=' + encodeURIComponent('New inquiry from ' + name) + '&body=' + encodeURIComponent(summaryText);
          okEl.textContent = 'Thank you, ' + name + '. Opening your email draft to ' + destValue + '...';
          okEl.classList.remove('hidden');
          window.location.href = mailUrl;
        } else {
          okEl.textContent = 'Thank you, ' + name + '. Your request has been recorded.';
          okEl.classList.remove('hidden');
        }
      });
    })();
  </script>
</body>
</html>`;
}
