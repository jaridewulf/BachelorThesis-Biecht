python3 -m venv myenv
source myenv/bin/activate
sudo rpi-update
pip install pygame scipy sounddevice pydub gpiozero
SDL_AUDIODRIVER=pulse /home/pi-jari/code/BachelorThesis-Biecht/phone/myenv/bin/python phone.py