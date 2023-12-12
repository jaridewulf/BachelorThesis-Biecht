import pygame
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
from pydub import AudioSegment

def playAudio(audioFile):
    # Play audio file
    pygame.mixer.init()
    pygame.mixer.music.load(audioFile)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy() == True:
        continue

def recordAudio(postion):
    # Record audio from the microphone
    fs = 48000  # Sample rate
    silence_threshold = 0.02  # Silence threshold
    silence_duration = 3  # Duration of silence in seconds
    buffer = np.array([])  # Buffer to store audio
    silence_duration_current = 0  # Current duration of silence

    print("Start talking")
    with sd.InputStream(samplerate=fs, channels=1) as stream:
        while True:
            audio = stream.read(1024)[0]  # Read audio from the microphone
            buffer = np.append(buffer, audio)  # Append audio to the buffer
            if np.abs(audio).mean() < silence_threshold:  # If silence is detected
                silence_duration_current += len(audio) / fs  # Increase current duration of silence
                if silence_duration_current > silence_duration:  # If silence duration is reached
                    break  # Stop recording
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


def getUserFeedback():
    # Ask user about feedback about past event
    playAudio('audio/department_questions/dep_' + department_id + '.mp3')
    
    # Record feedback on closed question
    recordAudio('closedQuestion')

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

def getPersonalFeedback():
    # Ask for personal feedback
    playAudio('audio/sentiment/sentiment_' + sentiment_status + '.mp3')
    
    # Record feedback on open question
    recordAudio('openQuestion')

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

    # TODO: Play audio "Bedankt voor je feedback, je kan nu inhaken"

def saveData():
    location_id = '1' # Hardcoded for now

    # Set data to correct values for DB
    global sentiment_status

    if sentiment_status == '1':
        sentiment_status = 'POSITIVE'
    elif sentiment_status == '2':
        sentiment_status = 'NEGATIVE'

    print(department_id, sentiment_status, severity)

    # TODO: Data sent to backend
    print('saving data')

def resetProgram():
    # TODO: Implement code to reset the program state
    print('reseting program')

greetUser()
getDepartment()
getUserFeedback()
getFeedbackStatus()
getPersonalFeedback()
getFeedbackSeverity()
saveData()
resetProgram()
