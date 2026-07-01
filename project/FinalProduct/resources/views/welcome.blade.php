<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Task Manager</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <!-- Styles / Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        
        <!-- CSS Variables for your Vue components -->
        <style>
            :root {
                --ms-primary: #0078d4;
                --ms-secondary: #106ebe;
                --ms-success: #107c10;
                --ms-warning: #ff8c00;
                --ms-danger: #d13438;
                --ms-light: #fafafa;
                --ms-dark: #323130;
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Instrument Sans', sans-serif;
                background: #fafafa;
            }
        </style>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>