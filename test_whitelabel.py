#!/usr/bin/env python3
"""
Comprehensive end-to-end test of whitelabel pages for guide account 'testbot'
on production site niijima-koutsu.jp
"""

import requests
import re
import json
import sys
from urllib.parse import urlparse, parse_qs, urljoin

BASE_URL = "https://www.niijima-koutsu.jp"
GUIDE_SLUG = "testbot"
WHITELABEL_BASE = f"{BASE_URL}/g/{GUIDE_SLUG}"

# Module definitions: (url_slug, component_key, page_modules_slug)
MODULES = [
    ("medical-packages", "medical_packages", "medical-packages"),
    ("sai-clinic", "sai_clinic", "sai-clinic"),
    ("cancer-treatment", "cancer_treatment", "osaka-cancer-center"),
    ("wclinic-mens", "wclinic_mens", "wclinic-mens"),
    ("helene-clinic", "helene_clinic", "helene-clinic"),
    ("ginza-phoenix", "ginza_phoenix", "ginza-phoenix"),
    ("cell-medicine", "cell_medicine", "cell-medicine"),
    ("ac-plus", "ac_plus", "ac-plus"),
    ("igtc", "igtc", "igtc"),
    ("osaka-himak", "osaka_himak", "osaka-himak"),
    ("kindai-hospital", "kindai_hospital", "kindai-hospital"),
    ("hyogo-medical", "hyogo_medical", "hyogo-medical"),
]

# CTA path patterns that indicate checkout/consultation pages
CTA_PATTERNS = ["initial-consultation", "remote-consultation", "treatment", "checkout"]

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) WhitelabelTest/1.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,ja;q=0.8",
})

def fetch_page(url, label=""):
    """Fetch a page and return status info."""
    try:
        resp = SESSION.get(url, allow_redirects=True, timeout=30)
        redirected = resp.url != url
        return {
            "url": url,
            "label": label,
            "status_code": resp.status_code,
            "final_url": resp.url,
            "redirected": redirected,
            "html": resp.text,
            "content_length": len(resp.text),
        }
    except requests.exceptions.RequestException as e:
        return {
            "url": url,
            "label": label,
            "status_code": None,
            "final_url": None,
            "redirected": False,
            "html": "",
            "content_length": 0,
            "error": str(e),
        }

def extract_next_data(html):
    """Extract __NEXT_DATA__ JSON from the HTML."""
    match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            return None
    return None

def extract_all_hrefs(html):
    """Extract all href attributes from HTML."""
    return re.findall(r'href=["\']([^"\']*)["\']', html)

def classify_link(href, module_url_slug):
    """Classify a link found on a whitelabel module page."""
    # Check if it's a CTA link (consultation/treatment/checkout)
    is_cta = any(pattern in href for pattern in CTA_PATTERNS)

    # Check if it's a whitelabel-internal link
    is_whitelabel_internal = f"/g/{GUIDE_SLUG}" in href

    # Check if it has guide parameter
    parsed = urlparse(href)
    params = parse_qs(parsed.query)
    has_guide_param = "guide" in params

    # Check for dead links
    is_dead = href in ("#", "#contact-form", "javascript:void(0)", "")

    return {
        "href": href,
        "is_cta": is_cta,
        "is_whitelabel_internal": is_whitelabel_internal,
        "has_guide_param": has_guide_param,
        "is_dead": is_dead,
    }

def analyze_module_page(result, module_url_slug):
    """Analyze a module page's HTML for links."""
    html = result["html"]
    hrefs = extract_all_hrefs(html)
    next_data = extract_next_data(html)

    cta_links = []
    whitelabel_links = []
    dead_links = []
    broken_cta_links = []  # CTA links missing ?guide=testbot
    all_internal_links = []

    for href in hrefs:
        info = classify_link(href, module_url_slug)

        if info["is_dead"] and not href.startswith("#contact"):
            # Only flag truly dead links, not anchor links to sections on the same page
            pass

        if info["is_cta"]:
            cta_links.append(href)
            if not info["has_guide_param"] and not info["is_whitelabel_internal"]:
                broken_cta_links.append(href)

        if info["is_whitelabel_internal"]:
            whitelabel_links.append(href)

        # Track links that are dead (#) in whitelabel context
        if href == "#" or href == "javascript:void(0)":
            dead_links.append(href)

        # Track internal site links (not external, not anchors, not static assets)
        if href.startswith("/") and not href.startswith("/_next") and not href.startswith("/favicon"):
            all_internal_links.append(href)

    return {
        "cta_links": cta_links,
        "broken_cta_links": broken_cta_links,
        "whitelabel_links": whitelabel_links,
        "dead_links": dead_links,
        "all_internal_links": list(set(all_internal_links)),
        "has_next_data": next_data is not None,
        "next_data_keys": list(next_data.get("props", {}).get("pageProps", {}).keys()) if next_data else [],
    }

def check_checkout_page(checkout_url):
    """Fetch and analyze a checkout page."""
    full_url = urljoin(BASE_URL, checkout_url) if not checkout_url.startswith("http") else checkout_url
    result = fetch_page(full_url, label=f"Checkout: {checkout_url}")

    if result["status_code"] != 200:
        return result, {}

    html = result["html"]
    hrefs = extract_all_hrefs(html)

    # Look for back links
    back_links = []
    for href in hrefs:
        if f"/g/{GUIDE_SLUG}" in href:
            back_links.append(("whitelabel_back", href))
        elif "guide=" in href:
            back_links.append(("guide_param_back", href))

    # Look for create-checkout-session
    has_checkout_session = "create-checkout-session" in html

    # Look for form actions
    form_actions = re.findall(r'action=["\']([^"\']*)["\']', html)

    analysis = {
        "back_links": back_links,
        "has_checkout_session": has_checkout_session,
        "form_actions": form_actions,
        "all_hrefs_count": len(hrefs),
    }

    return result, analysis

def print_separator(char="=", length=80):
    print(char * length)

def main():
    print_separator()
    print("WHITELABEL PAGE SYSTEM - END-TO-END TEST REPORT")
    print(f"Guide: {GUIDE_SLUG}")
    print(f"Base URL: {WHITELABEL_BASE}")
    print_separator()

    # ========== STEP 1: Test Whitelabel Home Page ==========
    print("\n[1] WHITELABEL HOME PAGE")
    print_separator("-")

    home_result = fetch_page(WHITELABEL_BASE, label="Whitelabel Home")
    print(f"  URL: {WHITELABEL_BASE}")
    print(f"  Status: {home_result['status_code']}")
    print(f"  Redirected: {home_result['redirected']}")
    if home_result['redirected']:
        print(f"  Final URL: {home_result['final_url']}")
    print(f"  Content Length: {home_result['content_length']} bytes")

    if home_result["status_code"] == 200:
        home_hrefs = extract_all_hrefs(home_result["html"])
        nav_links = [h for h in home_hrefs if f"/g/{GUIDE_SLUG}/" in h]
        print(f"  Navigation links to modules ({len(nav_links)}):")
        for link in sorted(set(nav_links)):
            print(f"    -> {link}")

        home_next_data = extract_next_data(home_result["html"])
        if home_next_data:
            page_props = home_next_data.get("props", {}).get("pageProps", {})
            print(f"  __NEXT_DATA__ pageProps keys: {list(page_props.keys())}")
            # Check for module list in next data
            if "modules" in page_props:
                print(f"  Modules in pageProps: {len(page_props['modules'])}")
            if "guide" in page_props:
                guide_info = page_props["guide"]
                if isinstance(guide_info, dict):
                    print(f"  Guide info keys: {list(guide_info.keys())}")
    elif home_result.get("error"):
        print(f"  ERROR: {home_result['error']}")

    # ========== STEP 2: Test Each Module Page ==========
    print("\n\n[2] MODULE PAGES")
    print_separator("-")

    all_checkout_urls = set()
    module_results = {}

    for url_slug, component_key, pm_slug in MODULES:
        module_url = f"{WHITELABEL_BASE}/{url_slug}"
        print(f"\n  --- Module: {url_slug} (component_key={component_key}, pm_slug={pm_slug}) ---")

        result = fetch_page(module_url, label=f"Module: {url_slug}")
        print(f"  URL: {module_url}")
        print(f"  Status: {result['status_code']}")
        if result['redirected']:
            print(f"  REDIRECTED to: {result['final_url']}")
        print(f"  Content Length: {result['content_length']} bytes")

        if result.get("error"):
            print(f"  ERROR: {result['error']}")
            module_results[url_slug] = {"result": result, "analysis": None}
            continue

        if result["status_code"] == 200:
            analysis = analyze_module_page(result, url_slug)
            module_results[url_slug] = {"result": result, "analysis": analysis}

            print(f"  Has __NEXT_DATA__: {analysis['has_next_data']}")
            if analysis['next_data_keys']:
                print(f"  pageProps keys: {analysis['next_data_keys']}")

            # CTA links
            if analysis['cta_links']:
                print(f"  CTA Links ({len(analysis['cta_links'])}):")
                for link in analysis['cta_links']:
                    has_guide = "guide=" in link
                    status = "OK (has guide param)" if has_guide else "BROKEN (missing guide param)"
                    print(f"    -> {link}  [{status}]")
                    # Collect for checkout testing
                    all_checkout_urls.add(link)
            else:
                print(f"  CTA Links: NONE FOUND in server-rendered HTML")

            # Broken CTA links
            if analysis['broken_cta_links']:
                print(f"  *** BROKEN CTA LINKS (missing ?guide=testbot): {len(analysis['broken_cta_links'])} ***")
                for link in analysis['broken_cta_links']:
                    print(f"    !!! {link}")

            # Whitelabel internal links
            if analysis['whitelabel_links']:
                print(f"  Whitelabel-internal links ({len(analysis['whitelabel_links'])}):")
                for link in sorted(set(analysis['whitelabel_links'])):
                    print(f"    -> {link}")

            # Dead links
            if analysis['dead_links']:
                print(f"  Dead links (#/javascript:void): {len(analysis['dead_links'])}")

            # All internal links (for debugging)
            if analysis['all_internal_links']:
                print(f"  All internal links ({len(analysis['all_internal_links'])}):")
                for link in sorted(analysis['all_internal_links']):
                    # Flag links that should be whitelabel but aren't
                    if any(p in link for p in CTA_PATTERNS):
                        flag = " [CTA]"
                    elif f"/g/{GUIDE_SLUG}" in link:
                        flag = " [WHITELABEL]"
                    else:
                        flag = ""
                    print(f"    -> {link}{flag}")
        else:
            module_results[url_slug] = {"result": result, "analysis": None}
            print(f"  Page returned non-200 status")

    # ========== STEP 3: Test Checkout Pages ==========
    print("\n\n[3] CHECKOUT PAGES")
    print_separator("-")

    if not all_checkout_urls:
        print("  No CTA/checkout URLs found in server-rendered HTML.")
        print("  This may be because pages use client-side rendering (Next.js React components).")
        print("  Attempting to check common checkout URL patterns...")

        # Try common patterns based on known module slugs
        common_checkout_patterns = []
        for url_slug, component_key, pm_slug in MODULES:
            # The checkout URL typically uses the page_modules slug or a clinic-specific path
            for cta_type in ["initial-consultation", "remote-consultation"]:
                # Try with component_key style (hyphens)
                common_checkout_patterns.append(f"/{url_slug}/{cta_type}?guide={GUIDE_SLUG}")
                # Try with pm_slug
                if pm_slug != url_slug:
                    common_checkout_patterns.append(f"/{pm_slug}/{cta_type}?guide={GUIDE_SLUG}")

        # Test a subset of likely patterns
        test_patterns = [
            f"/igtc/initial-consultation?guide={GUIDE_SLUG}",
            f"/sai-clinic/initial-consultation?guide={GUIDE_SLUG}",
            f"/medical-packages/initial-consultation?guide={GUIDE_SLUG}",
            f"/osaka-cancer-center/initial-consultation?guide={GUIDE_SLUG}",
            f"/cancer-treatment/initial-consultation?guide={GUIDE_SLUG}",
            f"/wclinic-mens/initial-consultation?guide={GUIDE_SLUG}",
            f"/helene-clinic/initial-consultation?guide={GUIDE_SLUG}",
            f"/ginza-phoenix/initial-consultation?guide={GUIDE_SLUG}",
            f"/cell-medicine/initial-consultation?guide={GUIDE_SLUG}",
            f"/ac-plus/initial-consultation?guide={GUIDE_SLUG}",
            f"/osaka-himak/initial-consultation?guide={GUIDE_SLUG}",
            f"/kindai-hospital/initial-consultation?guide={GUIDE_SLUG}",
            f"/hyogo-medical/initial-consultation?guide={GUIDE_SLUG}",
        ]
        all_checkout_urls = set(test_patterns)

    checkout_results = {}
    for checkout_url in sorted(all_checkout_urls):
        full_url = urljoin(BASE_URL, checkout_url) if not checkout_url.startswith("http") else checkout_url
        print(f"\n  --- Checkout: {checkout_url} ---")

        result, analysis = check_checkout_page(checkout_url)
        checkout_results[checkout_url] = {"result": result, "analysis": analysis}

        print(f"  URL: {full_url}")
        print(f"  Status: {result['status_code']}")
        if result['redirected']:
            print(f"  REDIRECTED to: {result['final_url']}")
        if result.get("error"):
            print(f"  ERROR: {result['error']}")
        elif result['status_code'] == 200:
            print(f"  Content Length: {result['content_length']} bytes")
            if analysis.get("back_links"):
                print(f"  Back links:")
                for btype, blink in analysis["back_links"]:
                    print(f"    [{btype}] {blink}")
            else:
                print(f"  Back links: NONE FOUND pointing to whitelabel")
            print(f"  Has create-checkout-session: {analysis.get('has_checkout_session', False)}")
            if analysis.get("form_actions"):
                print(f"  Form actions: {analysis['form_actions']}")

    # ========== STEP 4: Also check __NEXT_DATA__ for dynamic content ==========
    print("\n\n[4] __NEXT_DATA__ ANALYSIS")
    print_separator("-")

    for url_slug, component_key, pm_slug in MODULES:
        mr = module_results.get(url_slug, {})
        result = mr.get("result", {})
        if result.get("status_code") != 200:
            continue

        next_data = extract_next_data(result.get("html", ""))
        if not next_data:
            print(f"\n  {url_slug}: No __NEXT_DATA__ found")
            continue

        page_props = next_data.get("props", {}).get("pageProps", {})
        print(f"\n  {url_slug}:")
        print(f"    pageProps keys: {list(page_props.keys())}")

        # Look for guide info
        if "guide" in page_props:
            guide = page_props["guide"]
            if isinstance(guide, dict):
                print(f"    guide.slug: {guide.get('slug', 'N/A')}")
                print(f"    guide.name: {guide.get('name', 'N/A')}")
                print(f"    guide keys: {list(guide.keys())}")

        # Look for module/page info
        for key in ["module", "pageModule", "page_module", "clinic", "facility"]:
            if key in page_props:
                val = page_props[key]
                if isinstance(val, dict):
                    print(f"    {key} keys: {list(val.keys())}")
                    if "slug" in val:
                        print(f"    {key}.slug: {val['slug']}")
                    if "name" in val:
                        print(f"    {key}.name: {val['name']}")

        # Look for links/CTAs in the data
        data_str = json.dumps(page_props)
        cta_matches = []
        for pattern in CTA_PATTERNS:
            if pattern in data_str:
                cta_matches.append(pattern)
        if cta_matches:
            print(f"    CTA patterns found in data: {cta_matches}")

        # Check if guide param is embedded in any URLs in the data
        guide_url_count = data_str.count(f"guide={GUIDE_SLUG}")
        if guide_url_count:
            print(f"    'guide={GUIDE_SLUG}' appears {guide_url_count} times in pageProps data")

    # ========== SUMMARY ==========
    print("\n\n" + "=" * 80)
    print("SUMMARY REPORT")
    print("=" * 80)

    # Module page status
    print("\n  MODULE PAGE STATUS:")
    ok_count = 0
    fail_count = 0
    for url_slug, _, _ in MODULES:
        mr = module_results.get(url_slug, {})
        result = mr.get("result", {})
        status = result.get("status_code", "N/A")
        redirected = result.get("redirected", False)
        redirect_info = f" -> {result.get('final_url', '')}" if redirected else ""
        symbol = "PASS" if status == 200 and not redirected else "FAIL"
        if status == 200:
            ok_count += 1
        else:
            fail_count += 1
        print(f"    [{symbol}] /g/testbot/{url_slug} -> {status}{redirect_info}")

    print(f"\n  Total: {ok_count} OK, {fail_count} FAILED out of {len(MODULES)} modules")

    # CTA link issues
    print("\n  CTA LINK ISSUES:")
    total_cta = 0
    total_broken = 0
    for url_slug, _, _ in MODULES:
        mr = module_results.get(url_slug, {})
        analysis = mr.get("analysis")
        if analysis:
            cta_count = len(analysis['cta_links'])
            broken_count = len(analysis['broken_cta_links'])
            total_cta += cta_count
            total_broken += broken_count
            if broken_count > 0:
                print(f"    [{url_slug}] {broken_count}/{cta_count} CTA links MISSING guide param")
                for link in analysis['broken_cta_links']:
                    print(f"      !!! {link}")

    if total_cta == 0:
        print("    No CTA links found in server-rendered HTML (likely client-side rendered)")
    else:
        print(f"\n  Total CTA links: {total_cta}, Broken: {total_broken}")

    # Checkout page status
    print("\n  CHECKOUT PAGE STATUS:")
    checkout_ok = 0
    checkout_fail = 0
    for url, data in sorted(checkout_results.items()):
        result = data["result"]
        status = result.get("status_code", "N/A")
        redirected = result.get("redirected", False)
        redirect_info = ""
        if redirected:
            redirect_info = f" -> {result.get('final_url', '')}"

        if status == 200:
            checkout_ok += 1
            symbol = "PASS"
        else:
            checkout_fail += 1
            symbol = "FAIL"
        print(f"    [{symbol}] {url} -> {status}{redirect_info}")

    print(f"\n  Total checkout pages: {checkout_ok} OK, {checkout_fail} FAILED out of {len(checkout_results)}")

    # Whitelabel home
    print(f"\n  WHITELABEL HOME: {home_result['status_code']}")

    print("\n" + "=" * 80)
    print("END OF REPORT")
    print("=" * 80)

if __name__ == "__main__":
    main()
