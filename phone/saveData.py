import requests
import time
import boto3
from botocore.exceptions import ClientError
from aws_cfg import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
import uuid
import boto3

# Vars
boto3.setup_default_session(aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
object_name = None
random_id = uuid.uuid4()
url =  "http://localhost:3000/feedback" #"http://49.12.236.9:3000/feedback" 

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
    data["audioUrl"] = soundfile_url_closed
    # data["audioUrlOpen"] = soundfile_url_open

    # Write data to the specified URL
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Data written successfully!")
    else:
        print(response.status_code)
        print("Failed to write data.")

# Example usage:
data = {
    "intensity": 5,
    "sentiment": "POSITIVE",
    "departmentId": 1,
    "locationId": 1,
}

soundfile_path_closed = "audio_closedQuestion.mp3"
soundfile_path_open = "audio_openQuestion.mp3"
send_soundfile_and_write_data(data, soundfile_path_closed, soundfile_path_open)
