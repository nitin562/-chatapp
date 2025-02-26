if($args.length -lt 1){
    Write-Host "Provide Directory Name"
    exit
}

$directory = $args[0]
$process="0"
if($args.length -eq 2){
    $process=$args[1]
}

$activatenv="venv\Scripts\activate"

& $activatenv

Set-Location -Path $directory

if($process -eq "0"){
    exit
}
elseif($process -eq "1"){
    # Run Server
    python manage.py runserver
}
else{
    exit
}