import pygame
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
from pydub import AudioSegment
from gpiozero import Button
import threading
import time
import requests
import boto3
from botocore.exceptions import ClientError
from aws_cfg import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
import uuid

########### PHONE LOGIC ###########
# Set up button on GPIO pin 26
button = Button(26)
data_received = False
data_sending = False
should_continue = True
data = {}

def playAudio(audioFile):
    global should_continue
    # Reset the flag to True at the start of each function
    should_continue = True
    # Play audio file
    pygame.mixer.init()
    pygame.mixer.music.load(audioFile)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy() == True and should_continue:
        continue
    if not should_continue:
        pygame.mixer.music.stop()

def recordAudio(postion):
    global should_continue
    # Reset the flag to True at the start of each function
    should_continue = True
    # Record audio from the microphone
    fs = 48000  # Sample rate
    silence_threshold = 0.02  # Silence threshold
    silence_duration = 3  # Duration of silence in seconds
    buffer = np.array([])  # Buffer to store audio
    silence_duration_current = 0  # Current duration of silence

    print("Start talking")
    with sd.InputStream(samplerate=fs, channels=1) as stream:
        while should_continue:
            audio = stream.read(1024)[0]  # Read audio from the microphone
            buffer = np.append(buffer, audio)  # Append audio to the buffer
            if np.abs(audio).mean() < silence_threshold:  # If silence is detected
                silence_duration_current += len(audio) / fs  # Increase current duration of silence
                if silence_duration_current > silence_duration:  # If silence duration is reached
                    break  # Stop recording
                if not should_continue:
                    break # Stop recording
            else:
                silence_duration_current = 0  # Reset current duration of silence
    print("Recording finished")

    # Normalize the audio data
    buffer_normalized = buffer / np.abs(buffer).max()

    # Save the audio file
    wav_file = 'audio_' + postion + '.wav'
    buffer_int16 = (buffer_normalized * 32767).astype(np.int16)  # Convert to 16-bit PCM
    write(wav_file, fs, buffer_int16)  # Save as WAV file

    # Convert WAV to MP3
    mp3_file = 'audio_' + postion + '.mp3'
    AudioSegment.from_wav(wav_file).export(mp3_file, format="mp3")

def greetUser():
    time.sleep(2.5)
    # Set reset state to false
    global should_continue
    should_continue = True
    # Play greeting audio
    playAudio('audio/greeting.mp3')

def getDepartment():
    # Prompt user to select department
    playAudio('audio/choose_department.mp3')
    
    # Get department
    print('Kies een nummer tussen 1 en 8 om een afdeling te selecteren:')
    data["departmentId"] = int(input())
    while data["departmentId"] not in [1, 2, 3, 4, 5, 6, 7, 8]:
        print('Geen correcte invoer, probeer opnieuw:')
        data["departmentId"] = int(input())
    print('Je selecteerde', data["departmentId"])

    if not should_continue:
        return


def getUserFeedback():
    # Ask user about feedback about past event
    playAudio('audio/department_questions/dep_' + str(data["departmentId"]) + '.mp3')
    
    # Record feedback on closed question
    recordAudio('closedQuestion')

    if not should_continue:
        return

def getFeedbackStatus():
    # Ask if the feedback positive or negative
    playAudio('audio/open_question/open_question_p1.mp3')
    playAudio('audio/departments/dep_' + str(data["departmentId"]) + '.mp3')
    playAudio('audio/open_question/open_question_p2.mp3')

    # Get sentiment
    data["sentiment"] = input("Enter 1 for positive feedback or 2 for negative feedback: ")
    while data["sentiment"] not in ['1', '2']:
        print("Invalid input. Please enter 1 for positive feedback or 2 for negative feedback.")
        data["sentiment"] = input("Enter 1 for positive feedback or 2 for negative feedback: ")

    if not should_continue:
        return

def getPersonalFeedback():
    # Ask for personal feedback
    playAudio('audio/sentiment/sentiment_' + data["sentiment"] + '.mp3')
    
    # Record feedback on open question
    recordAudio('openQuestion')

    if not should_continue:
        return

def getFeedbackIntensity():
    # Ask if the feedback positive or negative
    playAudio('audio/get_severity.mp3')

    # Get intensity
    print('Kies een nummer tussen 1 en 9 om de ernst te selecteren:')
    data["intensity"] = int(input())
    while data["intensity"] not in [1, 2, 3, 4, 5, 6, 7, 8, 9]:
        print('Geen correcte invoer, probeer opnieuw:')
        data["intensity"] = int(input())
    print('Je selecteerde', data["intensity"])

    if not should_continue:
        return

    # TODO: Play audio "Bedankt voor je feedback, je kan nu inhaken"
    print('Je kan nu inhaken')
    global data_received
    data_received = True

def resetProgram():
    global should_continue
    # Set the flag to False to indicate that the program should stop
    print('reseting program')
    should_continue = False
    data = None
    data["locationId"] = locationId
    data_received = False

# Set up a function that will run in the background while is running
def check_button():
    global data_received
    while True:
        if button.is_pressed:
            if data_received:
                print("Data received, sending sound files and writing data...")
                soundfile_path_closed = "audio_closedQuestion.mp3"
                soundfile_path_open = "audio_openQuestion.mp3"
                send_soundfile_and_write_data(data, soundfile_path_closed, soundfile_path_open)
            if not data_sending and not should_continue:
                resetProgram()

# Start a new thread that will run the check_button function
button_thread = threading.Thread(target=check_button)
# Set the thread as a daemon so it will automatically exit when the main program exits
button_thread.daemon = True
button_thread.start()

########### DATA LOGIC ###########
# Vars
boto3.setup_default_session(aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
object_name = None
random_id = uuid.uuid4()
url =  "http://49.12.236.9:3000/feedback" #"http://localhost:3000/feedback"

# Hardcoded data
locationId = 1

def upload_to_s3(file_name, bucket, object_name=None):
    print("Uploading file to S3 bucket...")
    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = str(random_id) + "_" + str(file_name)

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        print(e)
        return False
    print("File uploaded successfully!")
    return True 


def send_soundfile_and_write_data(data, soundfile_path_closed, soundfile_path_open):
    print("Sending sound files and writing data...")
    # Send sound files to S3 bucket
    bucket = "debiecht-audio-files"
    object_name_closed = upload_to_s3(soundfile_path_closed, bucket)
    object_name_open = upload_to_s3(soundfile_path_open, bucket)

    # Wait for sound file URLs
    soundfile_url_closed = None
    soundfile_url_open = None
    while soundfile_url_closed is None or soundfile_url_open is None:
        # Get sound file URLs from S3 bucket
        s3_client = boto3.client('s3')
        if soundfile_url_closed is None:
            soundfile_url_closed = f"https://{bucket}.s3.amazonaws.com/{str(random_id)}_audio_closedQuestion.mp3"
        if soundfile_url_open is None:
            soundfile_url_open = f"https://{bucket}.s3.amazonaws.com/{str(random_id)}_audio_openQuestion.mp3"
        time.sleep(1)  # Wait for 1 second before checking again

    # Add sound file URLs to data
    data["audioUrls"] = {"open": soundfile_url_open, "closed": soundfile_url_closed}

    # Set locationId
    data["locationId"] = locationId

    # Set sentiment
    if data["sentiment"] == "1":
        data["sentiment"] = "POSITIVE"
    elif data["sentiment"] == "2":
        data["sentiment"] = "NEGATIVE"

    # Write data to the specified URL
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Data written successfully!")
    else:
        print(response.status_code)
        print("Failed to write data.")

    # Reset program
    resetProgram()

########### PHONE FLOW ###########
while True:
    if not button.is_pressed and not data_sending and not data_received:
        greetUser()
        getDepartment()
        getUserFeedback()
        getFeedbackStatus()
        getPersonalFeedback()
        getFeedbackIntensity()
    time.sleep(0.1)  # Add a short delay to reduce CPU usage
