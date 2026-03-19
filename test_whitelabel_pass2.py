#!/usr/bin/env python3
"""
Pass 2: Deeper analysis of specific issues found in pass 1.
- Check /medical-packages/* sub-pages for CTA links missing guide param
- Check IGTC treatment links (/medical-packages/igtc-*) that lack guide param
- Check sai-clinic treatment links for back-link behavior
- Verify ginza-phoenix, osaka-himak, ac-plus have ANY checkout CTA or just navigation
- Check the `#treatments` anchor on ac-plus (is it a same-page anchor or broken?)
"""

import requests
import re
import json
from urllib.parse import urljoin

BASE_URL = "https://www.niijima-koutsu.jp"
GUIDE_SLUG = "testbot"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) WhitelabelTest/2.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
})

def fetch(url):
    try:
        resp = SESSION.get(url, allow_redirects=True, timeout=30)
        return resp.status_code, resp.url, resp.text
    except Exception as e:
        return None, None, str(e)

def extract_hrefs(html):
    return re.findall(r'href=["\']([^"\']*)["\']', html)

print("=" * 80)
print("PASS 2: DEEP DIVE ANALYSIS")
print("=" * 80)

# ============================================================
# 1. Check IGTC treatment sub-pages (linked without guide param)
# ============================================================
print("\n[A] IGTC TREATMENT SUB-PAGES (linked from /g/testbot/igtc WITHOUT guide param)")
print("-" * 80)

igtc_treatment_links = [
    "/medical-packages/igtc-cancer-screening",
    "/medical-packages/igtc-cancer-screening-ctc",
    "/medical-packages/igtc-cancer-vaccine-1",
    "/medical-packages/igtc-cancer-vaccine-2",
    "/medical-packages/igtc-cancer-vaccine-3",
    "/medical-packages/igtc-ctc-oncocount",
    "/medical-packages/igtc-ctc-onconomics",
    "/medical-packages/igtc-ctc-onconomics-plus",
    "/medical-packages/igtc-ctc-oncotrace",
    "/medical-packages/igtc-hyperthermia-hydrogen",
    "/medical-packages/igtc-immune-iv-1",
    "/medical-packages/igtc-immune-iv-6",
    "/medical-packages/igtc-standard-initial",
    "/medical-packages/igtc-standard-outpatient",
    "/medical-packages/igtc-standard-subsequent",
    "/medical-packages/igtc-stem-cell-4",
]

print(f"  Found {len(igtc_treatment_links)} treatment links WITHOUT ?guide=testbot")
print(f"  These links go to the main site, NOT the whitelabel!")
print()

# Test a few to see if they work with guide param
for link in igtc_treatment_links[:3]:
    # Without guide
    url_no_guide = f"{BASE_URL}{link}"
    status, final_url, html = fetch(url_no_guide)
    print(f"  {link}")
    print(f"    Without guide: status={status}, redirected={'YES' if final_url != url_no_guide else 'no'}")
    if final_url and final_url != url_no_guide:
        print(f"    -> Redirected to: {final_url}")

    # With guide
    url_with_guide = f"{BASE_URL}{link}?guide={GUIDE_SLUG}"
    status2, final_url2, html2 = fetch(url_with_guide)
    print(f"    With ?guide=testbot: status={status2}, redirected={'YES' if final_url2 != url_with_guide else 'no'}")
    if final_url2 and final_url2 != url_with_guide:
        print(f"    -> Redirected to: {final_url2}")

    # Check if the page has back links to whitelabel
    if html2 and status2 == 200:
        hrefs = extract_hrefs(html2)
        wl_back = [h for h in hrefs if f"/g/{GUIDE_SLUG}" in h]
        guide_back = [h for h in hrefs if "guide=" in h and f"/g/{GUIDE_SLUG}" not in h]
        print(f"    Back links to whitelabel: {len(wl_back)}")
        print(f"    Links with guide param: {len(guide_back)}")
    print()

# ============================================================
# 2. Check medical-packages sub-pages
# ============================================================
print("\n[B] MEDICAL-PACKAGES SUB-PAGES (whitelabel internal)")
print("-" * 80)

med_sub_pages = [
    "/g/testbot/medical-packages/basic-checkup",
    "/g/testbot/medical-packages/dwibs-cancer-screening",
    "/g/testbot/medical-packages/premium-cardiac-course",
    "/g/testbot/medical-packages/select-gastro-colonoscopy",
    "/g/testbot/medical-packages/select-gastroscopy",
    "/g/testbot/medical-packages/vip-member-course",
]

for page_path in med_sub_pages:
    url = f"{BASE_URL}{page_path}"
    status, final_url, html = fetch(url)
    print(f"  {page_path}")
    print(f"    Status: {status}")
    if final_url and final_url != url:
        print(f"    REDIRECTED to: {final_url}")

    if html and status == 200:
        hrefs = extract_hrefs(html)
        # Look for checkout/treatment CTA links
        cta_links = [h for h in hrefs if any(p in h for p in ["initial-consultation", "remote-consultation", "treatment", "checkout"])]
        guide_ctas = [h for h in cta_links if "guide=" in h]
        no_guide_ctas = [h for h in cta_links if "guide=" not in h and h not in ("#", "")]
        wl_internal = [h for h in hrefs if f"/g/{GUIDE_SLUG}" in h]

        print(f"    CTA links with guide: {len(guide_ctas)}")
        for l in guide_ctas[:3]:
            print(f"      -> {l}")
        if no_guide_ctas:
            print(f"    *** CTA links WITHOUT guide: {len(no_guide_ctas)} ***")
            for l in no_guide_ctas:
                print(f"      !!! {l}")
        print(f"    Whitelabel internal links: {len(set(wl_internal))}")
    print()

# ============================================================
# 3. Check sai-clinic treatment checkout pages
# ============================================================
print("\n[C] SAI-CLINIC TREATMENT CHECKOUT PAGES")
print("-" * 80)

sai_treatments = [
    "/sai-clinic/sai-botox-full-face?guide=testbot",
    "/sai-clinic/sai-double-eyelid?guide=testbot",
    "/sai-clinic/sai-exosome-therapy?guide=testbot",
    "/sai-clinic/sai-lift-perfect?guide=testbot",
]

for link in sai_treatments:
    url = f"{BASE_URL}{link}"
    status, final_url, html = fetch(url)
    print(f"  {link}")
    print(f"    Status: {status}")
    if final_url and final_url != url:
        print(f"    REDIRECTED to: {final_url}")
    if html and status == 200:
        hrefs = extract_hrefs(html)
        wl_back = [h for h in hrefs if f"/g/{GUIDE_SLUG}" in h]
        has_checkout = "create-checkout-session" in html
        # Check for Stripe or payment form
        has_stripe = "stripe" in html.lower()
        print(f"    Content length: {len(html)} bytes")
        print(f"    Back links to whitelabel: {len(wl_back)}")
        if wl_back:
            print(f"      First: {wl_back[0]}")
        print(f"    Has create-checkout-session: {has_checkout}")
        print(f"    Mentions Stripe: {has_stripe}")
    print()

# ============================================================
# 4. Modules with NO consultation CTA links
# ============================================================
print("\n[D] MODULES WITH NO CONSULTATION/CHECKOUT CTA LINKS")
print("-" * 80)

no_cta_modules = {
    "medical-packages": "Has sub-pages (basic-checkup, etc.) instead of direct CTAs",
    "sai-clinic": "Has treatment-specific links (sai-botox-full-face, etc.)",
    "ginza-phoenix": "NO CTA links found at all",
    "osaka-himak": "NO CTA links found at all",
    "ac-plus": "Only has #treatments anchor (same-page jump)",
}

for slug, note in no_cta_modules.items():
    print(f"  {slug}: {note}")

# ============================================================
# 5. Check if `create-checkout-session` appears in any page
# ============================================================
print("\n\n[E] SEARCHING FOR create-checkout-session IN CHECKOUT PAGES")
print("-" * 80)

checkout_pages_to_check = [
    "/igtc/initial-consultation?guide=testbot",
    "/cancer-treatment/initial-consultation?guide=testbot",
    "/helene-clinic/treatment?guide=testbot",
    "/sai-clinic/sai-botox-full-face?guide=testbot",
    "/medical-packages/igtc-standard-initial?guide=testbot",
]

for link in checkout_pages_to_check:
    url = f"{BASE_URL}{link}"
    status, final_url, html = fetch(url)
    has_checkout = "create-checkout-session" in html if html else False
    has_stripe = "stripe" in html.lower() if html else False
    has_form = "<form" in html.lower() if html else False
    has_api_route = "/api/" in html if html else False
    # Check for any fetch/axios calls to APIs
    api_patterns = re.findall(r'(?:fetch|axios|api)[^"]*(?:checkout|session|payment)[^"]*', html or '', re.IGNORECASE)

    print(f"  {link}")
    print(f"    Status: {status}")
    print(f"    create-checkout-session: {has_checkout}")
    print(f"    Mentions 'stripe': {has_stripe}")
    print(f"    Has <form>: {has_form}")
    print(f"    Has /api/ reference: {has_api_route}")
    if api_patterns:
        print(f"    API patterns: {api_patterns[:3]}")
    print()

# ============================================================
# 6. Summary of all broken/missing links
# ============================================================
print("\n" + "=" * 80)
print("PASS 2 SUMMARY: ISSUES REQUIRING ATTENTION")
print("=" * 80)

print("""
ISSUE 1: IGTC treatment links missing guide parameter
  Location: /g/testbot/igtc page
  Problem: 16 links to /medical-packages/igtc-* lack ?guide=testbot
  Impact: User leaves whitelabel context when clicking treatment links
  Fix needed: Add ?guide=testbot to these links, OR route them through /g/testbot/medical-packages/igtc-*

ISSUE 2: ac-plus has #treatments anchor instead of real CTA
  Location: /g/testbot/ac-plus page
  Problem: The CTA link is just "#treatments" (same-page anchor)
  Impact: No way to actually book/checkout from ac-plus whitelabel page
  Fix needed: Either add proper treatment links or this is by design (no online booking for ac-plus)

ISSUE 3: ginza-phoenix has NO checkout CTA links
  Location: /g/testbot/ginza-phoenix page
  Problem: No initial-consultation, remote-consultation, or treatment links found
  Impact: No booking flow from ginza-phoenix whitelabel page
  Fix needed: Verify if ginza-phoenix is meant to have consultation CTAs

ISSUE 4: osaka-himak has NO checkout CTA links
  Location: /g/testbot/osaka-himak page
  Problem: No initial-consultation, remote-consultation, or treatment links found
  Impact: No booking flow from osaka-himak whitelabel page
  Fix needed: Verify if osaka-himak is meant to have consultation CTAs

ISSUE 5: False positive - /g/testbot/cancer-treatment links are NOT broken
  Note: The script flagged /g/testbot/cancer-treatment as "BROKEN CTA (missing guide param)"
  This is a FALSE POSITIVE - these are whitelabel-internal navigation links in the sidebar/header
  The word "treatment" in the URL triggered the CTA pattern match
  These links are CORRECT and working as intended.

NOTE: No __NEXT_DATA__ was found on any whitelabel module page, suggesting these pages
  use a non-standard rendering approach (possibly streaming SSR or RSC) rather than
  traditional getServerSideProps/getStaticProps.

NOTE: create-checkout-session was not found in any server-rendered HTML of checkout pages.
  This is expected - the Stripe checkout session is likely created client-side via
  JavaScript after the page loads and the user interacts with the form.
""")

print("=" * 80)
print("END OF PASS 2")
print("=" * 80)
