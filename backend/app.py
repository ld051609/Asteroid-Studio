from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from pydub import AudioSegment
from pydub.generators import Sine, Square, Sawtooth
import random
from google.cloud import storage
import os
app = Flask(__name__)
CORS(app)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './sona-story2.json'
def normalize(data):
    """Normalize data to the range [0, 1]."""
    min_val = np.min(data)
    max_val = np.max(data)
    return (data - min_val) / (max_val - min_val)


def generate_tone(frequency, duration_ms, volume_db):
    wave_forms = ['sine', 'square', 'sawtooth']
    random_int = random.randint(0, 2)
    waveform = wave_forms[random_int]
    if waveform == 'sine':
        tone = Sine(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'square':
        tone = Square(frequency).to_audio_segment(duration=duration_ms)
    elif waveform == 'sawtooth':
        tone = Sawtooth(frequency).to_audio_segment(duration=duration_ms)
    tone = tone + volume_db  # Adjust volume
    return tone


def create_sonification(features):
    df = pd.DataFrame(features)
    print(f'Features: {df}')

    # Convert date to datetime and extract year
    df['date'] = pd.to_datetime(df['date'])
    df['year'] = df['date'].dt.year

    # Convert velocity to float
    df['velocity'] = df['velocity'].astype(float)

    # Normalize velocity
    df['normalized_velocity'] = normalize(df['velocity'])

    min_year = df['year'].min()
    max_year = df['year'].max()
    min_velocity = df['normalized_velocity'].min()
    max_velocity = df['normalized_velocity'].max()

    # Initialize empty audio segment
    combined_audio = AudioSegment.silent(duration=0)

    for index, row in df.iterrows():
        year = row['year']
        velocity_normalized = row['normalized_velocity']

        # Map year to frequency (in Hz)
        frequency = np.interp(year, [min_year, max_year], [10, 1000])

        # Map normalized velocity to volume (in dB)
        volume_db = np.interp(velocity_normalized, [min_velocity, max_velocity], [-20, 0])

        # Duration in milliseconds
        duration_ms = 16  # Duration for each tone

        # Generate tone
        tone = generate_tone(frequency, duration_ms, volume_db)

        # Append tone to combined audio segment
        combined_audio += tone

    # Export combined audio track
    file_path = '/tmp/combined_sonification.mp3'  # Using /tmp for temporary storage
    combined_audio.export(file_path, format='mp3')
    return file_path


def upload_to_gcs(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to Google Cloud Storage and makes it public."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    blob.make_public()

    return blob.public_url


@app.route('/', methods=['POST'])
def get_asteroid():
    sound_data = request.get_json()
    sound_data = sound_data['features']
    print("Received data:", sound_data)  # Debugging line

    # Create sonification and save the file locally
    file_path = create_sonification(sound_data)

    # Upload the file to Google Cloud Storage
    bucket_name = 'sona-story'
    destination_blob_name = 'combined_sonification.mp3'
    public_url = upload_to_gcs(bucket_name, file_path, destination_blob_name)

    return jsonify({'success': True, 'public_url': public_url})


if __name__ == '__main__':
    app.run(debug=True)
