
$body = @{
    name = "Test User 2"
    email = "test2@example.com"
    password = "password123"
    role = "patient"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Success:"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error:"
    $_.Exception.Response.StatusCode
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.ReadToEnd()
}
