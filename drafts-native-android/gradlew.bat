@echo off

setlocal

set DIR=%~dp0
set GRADLE_HOME=%DIR%.gradle

if not exist "%GRADLE_HOME%" (
    set GRADLE_HOME=%USERPROFILE%\.gradle
)

if exist "%GRADLE_HOME%\bin\gradle.bat" (
    call "%GRADLE_HOME%\bin\gradle.bat" %*
) else (
    echo Gradle not found. Please install Gradle or run from Android Studio.
    exit /b 1
)