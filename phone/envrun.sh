cd /home/pi-jari/code/BachelorThesis-Biecht/phone
python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt
SDL_AUDIODRIVER=pulse /home/pi-jari/code/BachelorThesis-Biecht/phone/myenv/bin/python phone.py