var host = "documentacion-laravel.com";

if (window.location.host == host && window.location.protocol != "https:") {
    window.location.protocol = "https:"
}