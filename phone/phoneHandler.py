import pygame

def playAudio(audioFile):
    # Play audio file
    pygame.mixer.init()
    pygame.mixer.music.load(audioFile)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy() == True:
        continue

def greetUser():
    # Play greeting audio
    playAudio('audio/greeting.mp3')

def getDepartment():
    global user_input
    # Prompt user to select department
    playAudio('audio/choose_department.mp3')
    
    # Get department
    print('Kies een nummer tussen 1 en 8 om een afdeling te selecteren:')
    user_input = input()
    while user_input not in ['1', '2', '3', '4', '5', '6', '7', '8']:
        print('Geen correcte invoer, probeer opnieuw:')
        user_input = input()
    print('Je selecteerde', user_input)


def getUserFeedback():
    # Ask user about feedback about past event
    playAudio('audio/department_questions/dep_' + user_input + '.mp3')
    
    # Record Feedback

def getFeedbackStatus():
    # Ask if the feedback positive or negative
    playAudio('audio/open_question/open_question_p1.mp3')
    playAudio('audio/departments/dep_' + user_input + '.mp3')
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
    
    # Record Feedback

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

def saveData():
    # Data sent to backend
    print('saving data')

def resetProgram():
    # Implement code to reset the program state
    print('reseting program')

greetUser()
resetProgram()
getDepartment()
getUserFeedback()
getFeedbackStatus()
getPersonalFeedback()
getFeedbackSeverity()
saveData()
resetProgram()
