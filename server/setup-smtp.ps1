# Interactive SMTP setup script
# Usage: Open PowerShell in this folder and run: .\setup-smtp.ps1
# This script will prompt for SMTP user and App Password, write .env, restart the server, and run the test-send script.

param()

Write-Host "Interactive SMTP setup for Ullavar server" -ForegroundColor Cyan

$smtpUser = Read-Host "Enter SMTP user (email address)"
if ([string]::IsNullOrWhiteSpace($smtpUser)) { Write-Host 'SMTP user cannot be empty' -ForegroundColor Red; exit 1 }

# Read password securely
$smtpPassSecure = Read-Host "Enter SMTP App Password (will be hidden)" -AsSecureString
# Convert SecureString to plain text for writing to .env (be careful with this!)
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($smtpPassSecure)
try { $smtpPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }

$envFile = @"
SMTP_USER=$smtpUser
SMTP_PASS=$smtpPass
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
TO_EMAIL=uzhavarconnect2025@gmail.com
FROM_EMAIL=$smtpUser
"@

$envPath = Join-Path -Path (Get-Location) -ChildPath '.env'
Set-Content -Path $envPath -Value $envFile -Encoding UTF8
Write-Host "Wrote $envPath" -ForegroundColor Green

# Restart node processes and start the server
Write-Host "Restarting node server..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 300
Start-Process -NoNewWindow -FilePath 'node' -ArgumentList 'index.js' -WorkingDirectory (Get-Location)
Start-Sleep -Milliseconds 800

# Run the test-send script to verify
Write-Host "Running test-send.js to verify email sending..." -ForegroundColor Cyan
try {
    node test-send.js
} catch {
    Write-Host "test-send.js failed: $_" -ForegroundColor Yellow
}

Write-Host "If the test printed 'Email sent:' in server console and test-send printed success, emails should now be delivered to uzhavarconnect2025@gmail.com" -ForegroundColor Green
Write-Host "Do NOT commit the .env file with secrets to source control." -ForegroundColor Red
