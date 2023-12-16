python3 -m venv myenv
source myenv/bin/activate
pip install pygame scipy sounddevice pydub gpiozero requests boto3 botocore
SDL_AUDIODRIVER=pulse /home/pi-jari/code/BachelorThesis-Biecht/phone/myenv/bin/python phone.py