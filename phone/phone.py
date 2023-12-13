import pygame
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
from pydub import AudioSegment
from gpiozero import Button
import threading
import time

# Set up button on GPIO pin 26
button = Button(26)
data_received = False
data_sending = False
should_continue = True

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
    global department_id
    # Prompt user to select department
    playAudio('audio/choose_department.mp3')
    
    # Get department
    print('Kies een nummer tussen 1 en 8 om een afdeling te selecteren:')
    department_id = input()
    while department_id not in ['1', '2', '3', '4', '5', '6', '7', '8']:
        print('Geen correcte invoer, probeer opnieuw:')
        department_id = input()
    print('Je selecteerde', department_id)

    if not should_continue:
        return


def getUserFeedback():
    # Ask user about feedback about past event
    playAudio('audio/department_questions/dep_' + department_id + '.mp3')
    
    # Record feedback on closed question
    recordAudio('closedQuestion')

    if not should_continue:
        return

def getFeedbackStatus():
    # Ask if the feedback positive or negative
    playAudio('audio/open_question/open_question_p1.mp3')
    playAudio('audio/departments/dep_' + department_id + '.mp3')
    playAudio('audio/open_question/open_question_p2.mp3')

    # Get sentiment
    global sentiment_status
    sentiment_status = input("Enter 1 for positive feedback or 2 for negative feedback: ")
    while sentiment_status not in ['1', '2']:
        print("Invalid input. Please enter 1 for positive feedback or 2 for negative feedback.")
        sentiment_status = input("Enter 1 for positive feedback or 2 for negative feedback: ")

    if not should_continue:
        return

def getPersonalFeedback():
    # Ask for personal feedback
    playAudio('audio/sentiment/sentiment_' + sentiment_status + '.mp3')
    
    # Record feedback on open question
    recordAudio('openQuestion')

    if not should_continue:
        return

def getFeedbackSeverity():
    # Ask if the feedback positive or negative
    playAudio('audio/get_severity.mp3')

    # Get severity
    global severity
    print('Kies een nummer tussen 1 en 9 om de ernst te selecteren:')
    severity = input()
    while severity not in ['1', '2', '3', '4', '5', '6', '7', '8', '9']:
        print('Geen correcte invoer, probeer opnieuw:')
        severity = input()
    print('Je selecteerde', severity)

    if not should_continue:
        return

    # TODO: Play audio "Bedankt voor je feedback, je kan nu inhaken"

def saveData():
    location_id = '1' # Hardcoded for now
    # Set all data received to true
    global data_received
    if sentiment_status and severity and department_id and location_id:
        data_received = True

    # Set data to correct values for DB
    if sentiment_status == '1':
        sentiment_status = 'POSITIVE'
    elif sentiment_status == '2':
        sentiment_status = 'NEGATIVE'
    else:
        print("Invalid sentiment_status value")
        return

    print(department_id, sentiment_status, severity, location_id)

    # TODO: Data sent to backend set data_sending to true
    global data_sending
    print('saving data')
    data_sending = True

    # TODO: caught backend response and set data_sending false
    print('data sent')
    data_sending = False
    data_received = False

def resetProgram():
    global should_continue
    # Set the flag to False to indicate that the program should stop
    print('reseting program')
    should_continue = False

# Set up a function that will run in the background while is running
def check_button():
    while True:
        if button.is_pressed:
            if data_received:
                saveData()
            if not data_sending and not should_continue:
                resetProgram()

# Start a new thread that will run the check_button function
button_thread = threading.Thread(target=check_button)
# Set the thread as a daemon so it will automatically exit when the main program exits
button_thread.daemon = True
button_thread.start()

# Phone flow
while True:
    if not button.is_pressed and not data_sending and not data_received:
        greetUser()
        getDepartment()
        getUserFeedback()
        getFeedbackStatus()
        getPersonalFeedback()
        getFeedbackSeverity()
    time.sleep(0.1)  # Add a short delay to reduce CPU usage
