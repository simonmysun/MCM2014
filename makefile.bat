@echo off
Call clean.bat
latex mcmpaper
latex mcmpaper
dvipdfmx mcmpaper
start mcmpaper.pdf