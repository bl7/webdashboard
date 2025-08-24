#!/bin/bash

# Redirect Testing Script for InstaLabel
# Tests all public routes to identify redirect issues

echo "🔍 Testing InstaLabel Public Routes for Redirect Issues"
echo "======================================================"

# Base URL
BASE_URL="https://www.instalabel.co"

# Array of public routes to test
ROUTES=(
    "/"
    "/features"
    "/uses"
    "/allergen-compliance"
    "/allergen-guide"
    "/plan"
    "/printbridge"
    "/about"
    "/bookdemo"
    "/square-integration"
    "/faqs"
    "/privacy-policy"
    "/terms"
    "/cookie-policy"
    "/blog"
)

# Function to test a single route
test_route() {
    local route=$1
    local full_url="${BASE_URL}${route}"
    
    echo -n "Testing ${route}... "
    
    # Get HTTP status and location header
    response=$(curl -s -I -w "%{http_code}|%{redirect_url}" "$full_url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        # Extract status code and redirect URL
        status_code=$(echo "$response" | tail -n1 | cut -d'|' -f1)
        redirect_url=$(echo "$response" | tail -n1 | cut -d'|' -f2)
        
        if [ "$status_code" = "200" ]; then
            echo "✅ OK (200)"
        elif [ "$status_code" = "301" ] || [ "$status_code" = "302" ] || [ "$status_code" = "307" ] || [ "$status_code" = "308" ]; then
            echo "⚠️  REDIRECT ($status_code) → $redirect_url"
        else
            echo "❌ ERROR ($status_code)"
        fi
    else
        echo "❌ FAILED"
    fi
}

# Test domain redirects
echo ""
echo "🌐 Testing Domain Redirects:"
echo "----------------------------"

echo -n "Testing http://instalabel.co... "
http_response=$(curl -s -I -w "%{http_code}|%{redirect_url}" "http://instalabel.co" 2>/dev/null)
if [ $? -eq 0 ]; then
    http_status=$(echo "$http_response" | tail -n1 | cut -d'|' -f1)
    http_redirect=$(echo "$http_response" | tail -n1 | cut -d'|' -f2)
    echo "Status: $http_status, Redirect: $http_redirect"
else
    echo "Failed"
fi

echo -n "Testing https://instalabel.co... "
https_response=$(curl -s -I -w "%{http_code}|%{redirect_url}" "https://instalabel.co" 2>/dev/null)
if [ $? -eq 0 ]; then
    https_status=$(echo "$https_response" | tail -n1 | cut -d'|' -f1)
    https_redirect=$(echo "$https_response" | tail -n1 | cut -d'|' -f2)
    echo "Status: $https_status, Redirect: $https_redirect"
else
    echo "Failed"
fi

echo ""
echo "📄 Testing Public Routes:"
echo "-------------------------"

# Test each route
for route in "${ROUTES[@]}"; do
    test_route "$route"
done

echo ""
echo "🔧 Testing Sitemap and Robots:"
echo "------------------------------"

# Test sitemap
echo -n "Testing /sitemap.xml... "
sitemap_status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/sitemap.xml")
if [ "$sitemap_status" = "200" ]; then
    echo "✅ OK (200)"
else
    echo "❌ ERROR ($sitemap_status)"
fi

# Test robots.txt
echo -n "Testing /robots.txt... "
robots_status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/robots.txt")
if [ "$robots_status" = "200" ]; then
    echo "✅ OK (200)"
else
    echo "❌ ERROR ($robots_status)"
fi

echo ""
echo "📊 Summary:"
echo "==========="
echo "✅ All public routes should return 200 status codes"
echo "⚠️  Any redirects (301, 302, 307, 308) indicate potential SEO issues"
echo "❌ Any errors (4xx, 5xx) need immediate attention"
echo ""
echo "💡 Next Steps:"
echo "1. Fix any redirects to return 200 status codes"
echo "2. Ensure canonical URLs point to final destinations"
echo "3. Update sitemap with correct URLs"
echo "4. Test again after fixes"
