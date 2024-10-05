@echo off
setlocal enabledelayedexpansion

:: Generate timestamp
for /f "tokens=2 delims==" %%I in ('wmic OS Get localdatetime /value') do set "datetime=%%I"
set "timestamp=%datetime:~0,8%-%datetime:~8,6%"

set "output_file=source.%timestamp%.txt"
if exist "%output_file%" del "%output_file%"

:: Count total files
set "total_files=0"
for %%F in (angular.json package.json package-lock.json tsconfig.json tsconfig.app.json) do set /a "total_files+=1"
for /r src %%F in (*) do set /a "total_files+=1"

:: Initialize progress variables
set "processed_files=0"
set "progress_bar_length=50"

:: Process root files
for %%F in (angular.json package.json package-lock.json tsconfig.json tsconfig.app.json) do (
    call :process_file "%%F"
)

:: Process src directory
for /r src %%F in (*) do (
    call :process_file "%%F"
)

echo.
echo Project summary has been saved to %output_file%
goto :eof

:process_file
set "content="
for /f "delims=" %%L in (%~1) do (
    set "line=%%L"
    set "line=!line: =!"
    if defined content (
        set "content=!content!!line!"
    ) else (
        set "content=!line!"
    )
)
echo %~1: !content!>>"%output_file%"

:: Update progress
set /a "processed_files+=1"
set /a "percent=(processed_files*100)/total_files"
set /a "completed=(percent*progress_bar_length)/100"
set "progress_bar="
for /l %%A in (1,1,%completed%) do set "progress_bar=!progress_bar!#"
for /l %%A in (%completed%,1,%progress_bar_length%) do set "progress_bar=!progress_bar!."
echo [!progress_bar!] !percent!%%  !processed_files!/!total_files! files processed  ^r
exit /b
